import Navbar from "@/components/nav/Navbar";
import { Outlet } from "react-router";

const PageLayout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default PageLayout;
