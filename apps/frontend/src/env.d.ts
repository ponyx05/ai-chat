/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@ant-design/icons-vue" {
  import type {
    FunctionalComponent,
    HTMLAttributes,
    VNodeHTMLAttributes,
  } from "vue";
  interface IconProps {
    class?: string;
    style?: string;
    spin?: boolean;
    rotate?: number | string;
    component?: FunctionalComponent<HTMLAttributes & VNodeHTMLAttributes>;
  }
  export const MoreOutlined: FunctionalComponent<IconProps>;
  export const EditOutlined: FunctionalComponent<IconProps>;
  export const UpOutlined: FunctionalComponent<IconProps>;
  export const PlusOutlined: FunctionalComponent<IconProps>;
  export const DeleteOutlined: FunctionalComponent<IconProps>;
  export const UserOutlined: FunctionalComponent<IconProps>;
  export const DownOutlined: FunctionalComponent<IconProps>;
  export const SendOutlined: FunctionalComponent<IconProps>;
  export const CheckOutlined: FunctionalComponent<IconProps>;
  export const CopyOutlined: FunctionalComponent<IconProps>;
}
