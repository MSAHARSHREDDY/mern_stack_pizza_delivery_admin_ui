
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
  theme,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "../../Store";
import React from "react";
import TenantFilter from "./TenantsFilter";
import { createTenant, getTenants, updateTenant, } from "../../http/Api";
import TenantForm from "./forms/TenantForm";
import type { CreateTenantData, FieldData, Tenant } from "../../types";
import { PER_PAGE } from "../../Constants";

import { debounce } from "lodash";

const columnsData = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const TenantsPage = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [currentEditingTenant, setCurrentEditingTenant] =React.useState<Tenant | null>(null);

  const [queryParams, setQueryParams] = React.useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const [drawerOpen, setDrawerOpen] = React.useState(false);

   //It is used to run when on click on edit option in a table
      React.useEffect(() => {
          if (currentEditingTenant) {
              console.log('currentEditingTenant', currentEditingTenant);
              setDrawerOpen(true);
              form.setFieldsValue({ ...currentEditingTenant});
          }
      }, [currentEditingTenant, form]);

  const {
    data: tenants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  //Here after form is submitted we are posting data to the backend
  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: CreateTenantData) =>
      createTenant(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });//again we need to fetch tenant data to display new data we need to write like this,so that it calls new tenant data
      return;
    },
  });

   const { mutate: updateTenantMutation } = useMutation({
          mutationKey: ['update-tenant'],
          mutationFn: async (data: CreateTenantData) =>
              updateTenant(data, currentEditingTenant!.id).then((res) => res.data),
          onSuccess: async () => {
              queryClient.invalidateQueries({ queryKey: ['tenants'] });
              return;
          },
      });

      //when you click on submit it calls this function,It is used for form submission for input fields from tenant
   const onHandleSubmit = async () => {
        await form.validateFields();
        const isEditMode = !!currentEditingTenant;//it it is in editable
        if (isEditMode) {
            await updateTenantMutation(form.getFieldsValue());
        } else {
            await tenantMutate(form.getFieldsValue());
        }
        form.resetFields();//once you submit it clear all the values
        setCurrentEditingTenant(null);
        setDrawerOpen(false);//It closes drawer once form is submitted
    };



  const debouncedQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changedFilterFields }));
    }
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Tenants" },
            ]}
          />
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <TenantFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Restaurant
            </Button>
          </TenantFilter>
        </Form>

     
        <Table
          columns={[
            ...columnsData,
            {
              title: "Actions",
              render: (_: string, record: Tenant) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentEditingTenant(record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={tenants?.data}
          rowKey={"id"}
          pagination={{
            total: tenants?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              console.log(page);
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
          }}
        />

        <Drawer
          title={currentEditingTenant ? 'Edit Tenant' : 'Add Tenant'}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
             form.resetFields();//once you press "x" it clear all the values
                setCurrentEditingTenant(null);
                setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default TenantsPage;
