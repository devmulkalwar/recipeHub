import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
} from "@material-tailwind/react";

export function CategoryTabs() {
  const [activeTab, setActiveTab] = React.useState("breakfast");
  
  const data = [
    {
      label: "Breakfast",
      value: "breakfast",
      desc: `Start your day with these delicious breakfast recipes that are quick and easy to make. Fuel your morning with healthy options!`,
    },
    {
      label: "Lunch",
      value: "lunch",
      desc: `Discover a variety of lunch recipes that are perfect for work or school. Quick to prepare and satisfying to eat!`,
    },
    {
      label: "Dinner",
      value: "dinner",
      desc: `End your day with hearty dinner recipes that bring everyone to the table. From comfort food to healthy options, we have it all!`,
    },
    {
      label: "Desserts",
      value: "desserts",
      desc: `Indulge in our collection of sweet treats! From cakes to cookies, these dessert recipes are sure to satisfy your sweet tooth.`,
    },
    {
      label: "Snacks",
      value: "snacks",
      desc: `Looking for something to munch on? Try these quick and easy snack recipes that are perfect for any time of day!`,
    },
  ];

  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
        }}
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-gray-900" : ""}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            <Typography variant="small" className="text-gray-700">
              {desc}
            </Typography>
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
