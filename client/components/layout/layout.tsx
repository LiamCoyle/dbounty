import { ReactNode } from "react";
import MenuAppBar from "../navbar/navbar";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const Layout = ({ children }: Props) => {
  return (
    <div>
      <MenuAppBar />

      <main>{children}</main>
    </div>
  );
};

export default Layout;
