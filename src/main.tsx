import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import "antd/dist/reset.css"
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient=new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/**it is used when you are using react query */}
          <ConfigProvider theme={{
              token:{
                colorPrimary:"#F65F42",
                colorLink:"#F65F42"
              }
            }}>
              <RouterProvider router={router}/>
          </ConfigProvider>
    </QueryClientProvider>
    
  </StrictMode>,
)
