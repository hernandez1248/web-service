import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import MiniDrawerEmployee from "./MiniDrawerEmployee";
import MiniDrawer from "./MiniDrawer";

const Drawer = (props) => {
  //const [isAdmin, setIsAdmin] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.rol === "administrador";
  /*
  useEffect(() => { 

    setIsAdmin(
      session.user?.rol === "administrador"
    );
  }, session);
  */
  
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