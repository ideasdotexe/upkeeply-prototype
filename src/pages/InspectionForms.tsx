import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FormCard } from "@/components/FormCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formTemplates, getFormsByFrequency } from "@/lib/formTemplates";

export default function InspectionForms() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const dailyForms = getFormsByFrequency("daily");
  const weeklyForms = getFormsByFrequency("weekly");
  const monthlyForms = getFormsByFrequency("monthly");

  const getFilteredForms = () => {
    let forms = activeTab === "all" 
      ? formTemplates 
      : activeTab === "daily" 
        ? dailyForms 
        : activeTab === "weekly" 
          ? weeklyForms 
          : monthlyForms;
    
    if (searchQuery) {
      forms = forms.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return forms;
  };

  const displayedForms = getFilteredForms();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inspection Forms</h1>
            <p className="text-muted-foreground mt-1">
              Select a form template to start a new inspection
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search forms..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Forms
              <Badge variant="secondary" className="ml-2">{formTemplates.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="daily">
              Daily
              <Badge variant="secondary" className="ml-2">{dailyForms.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="weekly">
              Weekly
              <Badge variant="secondary" className="ml-2">{weeklyForms.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="monthly">
              Monthly
              <Badge variant="secondary" className="ml-2">{monthlyForms.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {displayedForms.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No forms found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedForms.map((template) => (
                  <FormCard
                    key={template.id}
                    template={template}
                    onClick={() => navigate(`/form/${template.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}