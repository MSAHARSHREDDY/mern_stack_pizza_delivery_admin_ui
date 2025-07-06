// import { Card, Col, Form, Input, Row } from 'antd';

// type TenantsFilterProps = {
//     children?: React.ReactNode;
// };
// const TenantFilter = ({ children }: TenantsFilterProps) => {
//     return (
//         <Card>
//             <Row justify="space-between">
//                 <Col span={16}>
//                     <Row gutter={20}>
//                         <Col span={12}>
//                             <Form.Item name="q">
//                                 <Input.Search allowClear={true} placeholder="Search" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                 </Col>
//                 <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
//                     {children}
//                 </Col>
//             </Row>
//         </Card>
//     );
// };

// export default TenantFilter


import {  Card, Col, Input, Row, Select } from "antd";


type UsersFilterProps={
  children?:React.ReactNode
  onFilterChange:(filterName:string,filterValue:string)=>void
}
const TenantsFilter = ({onFilterChange,children}:UsersFilterProps) => {
  return (
    <>
      <Card>
        <Row justify="space-between">

          <Col span={16}>
            <Row gutter={20}>

              <Col span={12}>
              <Input.Search placeholder="Search" allowClear={true} onChange={(e)=>onFilterChange("SearchFilter",e.target.value)}/>
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

export default TenantsFilter;
