import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isYesterday } from "date-fns";
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
import { getInspections, CompletedInspection } from "@/lib/inspectionsStore";
import { supabase } from "@/integrations/supabase/client";

interface BuildingInfo {
  name: string;
  address: string;
  building_type: string;
  year_built: number | null;
  units: number;
  floors: number;
  parking_spots: number;
  amenities: string;
}

// Format inspection date for display
function formatInspectionDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MMM d, yyyy");
}

// Get greeting based on current time
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [openIssuesCount, setOpenIssuesCount] = useState(0);
  const [recentInspections, setRecentInspections] = useState<CompletedInspection[]>([]);
  const [userInfo, setUserInfo] = useState<{ fullName?: string; buildingId?: string } | null>(null);
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null);

  useEffect(() => {
    setOpenIssuesCount(getOpenIssuesCount());
    setRecentInspections(getInspections().slice(0, 5));
    
    const loginInfo = localStorage.getItem("loginInfo");
    if (loginInfo) {
      const parsed = JSON.parse(loginInfo);
      setUserInfo(parsed);
      
      // Fetch building info from database with session token
      if (parsed.buildingId && parsed.sessionToken) {
        fetchBuildingInfo(parsed.buildingId, parsed.sessionToken);
      }
    }
  }, []);

  const fetchBuildingInfo = async (buildingId: string, sessionToken: string) => {
    // Validate building ID format before making request
    if (!buildingId || buildingId.length > 100 || !/^[a-zA-Z0-9\s\-_.]+$/.test(buildingId)) {
      console.error("Invalid building ID format");
      return;
    }

    if (!sessionToken) {
      console.error("No session token available");
      return;
    }

    try {
      // Use secure Edge Function to fetch building info with JWT token
      const { data, error } = await supabase.functions.invoke("get-building-info", {
        body: { 
          buildingId: buildingId.trim(),
          sessionToken: sessionToken
        },
      });
      
      if (error) {
        console.error("Error fetching building info:", error);
        return;
      }
      
      if (data?.success && data?.building) {
        setBuildingInfo(data.building);
      }
    } catch (err) {
      console.error("Unexpected error fetching building info:", err);
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, {userInfo?.fullName || "User"}</h1>
            <p className="text-muted-foreground mt-1">
              Here's what needs your attention at <span className="font-medium text-foreground">{userInfo?.buildingId || "your building"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
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
                    <CardTitle className="text-base">{buildingInfo?.name || userInfo?.buildingId || "Building"}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {buildingInfo?.building_type || "Residential"} · Built {buildingInfo?.year_built || "N/A"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Units</p>
                    <p className="font-medium">{buildingInfo?.units || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Floors</p>
                    <p className="font-medium">{buildingInfo?.floors || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Parking Spots</p>
                    <p className="font-medium">{buildingInfo?.parking_spots || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Amenities</p>
                    <p className="font-medium">{buildingInfo?.amenities || "None"}</p>
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
                {recentInspections.length > 0 ? (
                  <div className="space-y-0">
                    {recentInspections.map((inspection) => (
                      <RecentInspection
                        key={inspection.id}
                        formName={inspection.formName}
                        date={formatInspectionDate(inspection.completedAt)}
                        status={inspection.status === "issues" ? "issues" : "completed"}
                        itemsCount={inspection.itemsCount}
                        issuesCount={inspection.issuesCount}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No inspections completed yet
                  </p>
                )}
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