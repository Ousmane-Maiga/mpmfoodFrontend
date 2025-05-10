import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "../../../../components/ui/Text";
import { DataTable } from "../../../../components/ui/DataTable";
import { sampleEmployees } from "../../../../constants/sampleData";
import { theme } from "../../../../constants/theme";
import { Link } from 'expo-router';

type Employee = {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  schedule?: Array<{ day: string; shift: string }>;
};

export default function EmployeesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={[theme.text.heading1, styles.header]}>Employees</Text>
      
      <DataTable<Employee>
        data={sampleEmployees}
        columns={[
          { 
            key: "name", 
            title: "Name",
            sortable: true,
            width: '40%',
            render: (value, item) => (
              <Link 
                href={{
                  pathname: "/admin/employees/[employeeId]", // ✅ Fixed
                  params: { 
                    employeeId: item.id, // ✅ Dynamic ID
                    name: item.name 
                  }
                }} 
                asChild
              >
                <Text style={{ color: theme.colors.primary }}>
                  {value}
                </Text>
              </Link>
            )
          },
          { 
            key: "role", 
            title: "Position",
            sortable: true,
            width: '30%'
          },
          { 
            key: "email", 
            title: "Email",
            width: '30%'
          }
        ]}
        pageSize={10}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
});





// import React from "react";
// import { ScrollView, StyleSheet } from "react-native";
// import { Text } from "../../../../components/ui/Text";
// import { DataTable } from "../../../../components/ui/DataTable";
// import { sampleEmployees } from "../../../../constants/sampleData";
// import { theme } from "../../../../constants/theme";
// import { Link } from 'expo-router';

// export default function EmployeesScreen() {
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={[theme.text.heading1, styles.header]}>Employees</Text>
      
//       <DataTable
//         data={sampleEmployees}
//         columns={[
//           { 
//             key: "name", 
//             title: "Name",
//             sortable: true,
//             width: '40%',
//             render: (value, item) => (
//               <Link 
//                 href={{
//                   pathname: `/admin/${item.id}`,
//                   params: { name: item.name }
//                 }} 
//                 asChild
//               >
//                 <Text style={{ color: theme.colors.primary }}>
//                   {value}
//                 </Text>
//               </Link>
//             )
//           },
//           { 
//             key: "role", 
//             title: "Position",
//             sortable: true,
//             width: '30%'
//           },
//           { 
//             key: "email", 
//             title: "Email",
//             width: '30%'
//           }
//         ]}
//         pageSize={10}
//         keyExtractor={(item) => item.id}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.md,
//   },
//   header: {
//     marginBottom: theme.spacing.lg,
//     color: theme.colors.text,
//   },
// });