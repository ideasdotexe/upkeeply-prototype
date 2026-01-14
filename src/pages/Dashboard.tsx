import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FormCard } from "@/components/FormCard";
import { StatsCard } from "@/components/StatsCard";
import { RecentInspection } from "@/components/RecentInspection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  Clock,
  AlertTriangle, 
  Calendar,
  Building2
} from "lucide-react";
import { formTemplates, getFormsByFrequency } from "@/lib/formTemplates";
import { getOpenIssuesCount } from "@/lib/issuesStore";

const recentInspections = [
  { formName: "Daily Maintenance", date: "Today, 8:30 AM", status: "completed" as const, itemsCount: 15 },
  { formName: "Fire Safety", date: "Yesterday", status: "issues" as const, itemsCount: 14, issuesCount: 2 },
  { formName: "Parking Garage", date: "Jan 9, 2026", status: "completed" as const, itemsCount: 11 },
  { formName: "Exterior", date: "Jan 8, 2026", status: "draft" as const, itemsCount: 12 },
  { formName: "Daily Maintenance", date: "Jan 8, 2026", status: "completed" as const, itemsCount: 15 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openIssuesCount, setOpenIssuesCount] = useState(0);

  useEffect(() => {
    setOpenIssuesCount(getOpenIssuesCount());
  }, []);

  const dailyForms = getFormsByFrequency("daily");
  const weeklyForms = getFormsByFrequency("weekly");
  const monthlyForms = getFormsByFrequency("monthly");

  const displayedForms = activeTab === "all" 
    ? formTemplates 
    : activeTab === "daily" 
      ? dailyForms 
      : activeTab === "weekly" 
        ? weeklyForms 
        : monthlyForms;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good morning, John</h1>
            <p className="text-muted-foreground mt-1">
              Here's what needs your attention at <span className="font-medium text-foreground">123 Main Street</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Saturday, January 11, 2026</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            title="Inspections This Week"
            value="12"
            subtitle="3 completed today"
            icon={ClipboardCheck}
            trend={{ value: 15, label: "vs last week" }}
          />
          <StatsCard
            title="Open Issues"
            value={openIssuesCount.toString()}
            subtitle="2 require contractor"
            icon={AlertTriangle}
            onClick={() => navigate("/issues")}
            className="cursor-pointer hover:shadow-card-hover transition-shadow"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms Section - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Inspection Forms</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="h-9">
                  <TabsTrigger value="all" className="text-xs px-3">
                    All
                    <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
                      {formTemplates.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="text-xs px-3">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs px-3">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs px-3">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedForms.map((template, index) => (
                <FormCard
                  key={template.id}
                  template={template}
                  onClick={() => navigate(`/form/${template.id}`)}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Building Info Card */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">123 Main Street</CardTitle>
                    <p className="text-xs text-muted-foreground">Residential · Built 2005</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Units</p>
                    <p className="font-medium">48</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Floors</p>
                    <p className="font-medium">12</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Parking Spots</p>
                    <p className="font-medium">72</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Amenities</p>
                    <p className="font-medium">Pool, Gym</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Inspections */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Inspections</CardTitle>
                  <button 
                    onClick={() => navigate("/calendar")}
                    className="text-xs text-primary hover:underline"
                  >
                    View all
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-0">
                  {recentInspections.map((inspection, index) => (
                    <RecentInspection
                      key={index}
                      {...inspection}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Inspections */}
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Fire Safety Due</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monthly inspection due in 3 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}