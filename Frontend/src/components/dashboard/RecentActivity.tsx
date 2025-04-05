
import React from "react";
import { CalendarIcon, CheckCircleIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "candidate" | "job" | "interview";
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "candidate":
        return <UserIcon className="h-5 w-5 text-blue-500" />;
      case "job":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "interview":
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 overflow-hidden">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-4 border-b last:border-0"
            >
              <div className="mr-4">{getIcon(activity.type)}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
