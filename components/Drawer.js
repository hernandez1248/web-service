import { useSession } from "next-auth/react";
import React from "react";
import MiniDrawerEmployee from "./MiniDrawerEmployee";
import MiniDrawer from "./MiniDrawer";

const Drawer = (props) => {
  const { data: session } = useSession();
  console.log(session);
  const isAdmin = session?.rol === "administrador";
  if (isAdmin) {
    return (
      <MiniDrawer>
        {props.children}
      </MiniDrawer>
    );
  }
  return (
    <MiniDrawerEmployee>
      {props.children}
    </MiniDrawerEmployee>
  );
};
 export default Drawer;