
import AddPersonality from "../pages/admin/AddPersonality";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllArticle from "../pages/admin/AllArticle";
import HomeHero from "../pages/admin/HomeHero";
import HomeHighlights from "../pages/admin/HomeHighlights";





export const adminPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <AdminDashboard />,
  },
  {
    name: "Blog Management",
    children: [
      {
        name: "Hero",
        path: "home-hero",
        element: <HomeHero />,
      },
      {
        name: "Highlights",
        path: "home-highlights",
        element: <HomeHighlights />,
      },
      {
        name: "Add Article",
        path: "home-article",
        element: <AllArticle />,
      },
      {
        name: "Add Personality",
        path: "home-personality",
        element: <AddPersonality />,
      },
    ],
  },
];


// export const adminSidebarItems = adminPaths.reduce(
//   (acc: TSidebarItem[], item) => {
//     if (item.path && item.name) {
//       acc.push({
//         key: item.name,
//         label: <NavLink to={`/admin/${item.path}`}>{item.name}</NavLink>,
//       });
//     }

//     if (item.children) {
//       acc.push({
//         key: item.name,
//         label: item.name,
//         children: item.children.map((child) => ({
//           key: child.name,
//           label: <NavLink to={`/admin/${child.path}`}>{child.name}</NavLink>,
//         })),
//       });
//     }
//     return acc;
//   },
//   []
// );
