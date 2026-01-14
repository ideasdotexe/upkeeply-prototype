import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  ClipboardCheck, 
  AlertTriangle,
  Clock
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { getInspections, CompletedInspection } from "@/lib/inspectionsStore";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const inspections = getInspections();

  // Get unique dates that have inspections
  const datesWithInspections = inspections.map(i => new Date(i.completedAt));

  // Get inspections for selected date
  const selectedDateInspections = selectedDate 
    ? inspections.filter(i => isSameDay(new Date(i.completedAt), selectedDate))
    : [];

  // Custom day content to show indicators
  const modifiers = {
    hasInspection: datesWithInspections,
    hasIssues: inspections
      .filter(i => i.status === "issues")
      .map(i => new Date(i.completedAt)),
  };

  const modifiersStyles = {
    hasInspection: {
      fontWeight: "bold" as const,
    },
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inspection Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View and access all completed inspection forms by date
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full pointer-events-auto"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                components={{
                  DayContent: ({ date }) => {
                    const hasInspection = datesWithInspections.some(d => isSameDay(d, date));
                    const hasIssues = inspections
                      .filter(i => i.status === "issues")
                      .some(i => isSameDay(new Date(i.completedAt), date));
                    
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {hasInspection && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                            <div className={cn(
                              "h-1 w-1 rounded-full",
                              hasIssues ? "bg-destructive" : "bg-success"
                            )} />
                          </div>
                        )}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Selected date details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-muted-foreground text-sm">
                  Click on a date to view completed inspections
                </p>
              ) : selectedDateInspections.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No inspections on this date
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {selectedDateInspections.length} inspection{selectedDateInspections.length > 1 ? "s" : ""} completed
                  </p>
                  {selectedDateInspections.map((inspection) => (
                    <InspectionCard key={inspection.id} inspection={inspection} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent inspections list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inspections.slice(0, 10).map((inspection) => (
                <div 
                  key={inspection.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setSelectedDate(new Date(inspection.completedAt))}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      inspection.status === "issues" ? "bg-destructive" : "bg-success"
                    )} />
                    <div>
                      <p className="font-medium text-sm">{inspection.formName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(inspection.completedAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {inspection.status === "issues" && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {inspection.issuesCount}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {inspection.itemsCount} items
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function InspectionCard({ inspection }: { inspection: CompletedInspection }) {
  return (
    <div className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">{inspection.formName}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(new Date(inspection.completedAt), "h:mm a")}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {inspection.status === "issues" ? (
            <Badge variant="destructive" className="gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
              {inspection.issuesCount} issue{(inspection.issuesCount || 0) > 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 text-xs bg-success/10 text-success border-success/20">
              <ClipboardCheck className="h-3 w-3" />
              Complete
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {inspection.itemsCount} items
          </span>
        </div>
      </div>
    </div>
  );
}