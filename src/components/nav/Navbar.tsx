import Logo from "../utils/Logo";

const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-white dark:bg-gray-800 shadow-md flex items-center px-4">
      <Logo />
    </nav>
  );
};

export default Navbar;
