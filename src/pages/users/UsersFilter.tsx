import {  Card, Col, Input, Row, Select } from "antd";


type UsersFilterProps={
  children?:React.ReactNode
  onFilterChange:(filterName:string,filterValue:string)=>void
}
const UsersFilter = ({onFilterChange,children}:UsersFilterProps) => {
  return (
    <>
      <Card>
        <Row justify="space-between">

          <Col span={16}>
            <Row gutter={20}>

              <Col span={8}>
              <Input.Search placeholder="Search" allowClear={true} onChange={(e)=>onFilterChange("SearchFilter",e.target.value)}/>
              </Col>

              <Col span={8}>
               <Select style={{width:"100%"}} allowClear={true} placeholder="select role" onChange={(selectedItem)=>onFilterChange("roleFilter",selectedItem)}>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
               </Select>
              </Col>

              <Col span={8}>
                <Select style={{width:"100%"}} allowClear={true} placeholder="status" onChange={(selectedItem)=>onFilterChange("statusFilter",selectedItem)}>
                  <Select.Option value="ban">Ban</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
               </Select>
              </Col>
              
            </Row>
          </Col>


          <Col span={8} style={{display:"flex", justifyContent:"end"}}>
          {children}
           
          </Col>


        </Row>
      </Card>
    </>
  );
};

export default UsersFilter;
