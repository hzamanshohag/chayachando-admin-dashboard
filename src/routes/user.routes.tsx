import UserDashboard from "../pages/user/UserDashboard";

// const userPaths = [
//   {
//     index: true,
//     element: <UserDashboard />,
//   },
//   {
//     path: "dashboard",
//     element: <UserDashboard />,
//   },
// ];

// export default userPaths;


export const userPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <UserDashboard />,
  },
  // {
  //   name: "Blog Management",
  //   children: [
  //     {
  //       name: "home",
  //       path: "home",
  //       element: <Home />,
  //     },
  //   ],
  // },
];