import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ClipboardList,
  RotateCcw
} from "lucide-react";
import { format } from "date-fns";
import { Issue, getIssues, resolveIssue, reopenIssue } from "@/lib/issuesStore";
import { toast } from "sonner";

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState("open");

  useEffect(() => {
    setIssues(getIssues());
  }, []);

  const openIssues = issues.filter(i => i.status === "open");
  const resolvedIssues = issues.filter(i => i.status === "resolved");

  const handleResolve = (issueId: string) => {
    const updatedIssues = resolveIssue(issueId);
    setIssues(updatedIssues);
    toast.success("Issue marked as resolved");
  };

  const handleReopen = (issueId: string) => {
    const updatedIssues = reopenIssue(issueId);
    setIssues(updatedIssues);
    toast.info("Issue reopened");
  };

  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-muted text-muted-foreground";
    }
  };

  const displayedIssues = activeTab === "open" ? openIssues : resolvedIssues;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Open Issues</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage inspection issues across all forms
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">{openIssues.length}</span>
              <span className="text-sm text-destructive/80">open</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">{resolvedIssues.length}</span>
              <span className="text-sm text-success/80">resolved</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="open" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Open Issues
              <Badge variant="secondary" className="ml-1">{openIssues.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Resolved
              <Badge variant="secondary" className="ml-1">{resolvedIssues.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {displayedIssues.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  {activeTab === "open" ? (
                    <>
                      <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">All clear!</h3>
                      <p className="text-muted-foreground">No open issues at the moment.</p>
                    </>
                  ) : (
                    <>
                      <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">No resolved issues</h3>
                      <p className="text-muted-foreground">Resolved issues will appear here.</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {displayedIssues.map((issue) => (
                  <Card key={issue.id} className="hover:shadow-card-hover transition-shadow overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Issue info */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-start gap-3">
                            <Badge className={`${getPriorityColor(issue.priority)} shrink-0`}>
                              {issue.priority}
                            </Badge>
                            <h3 className="font-semibold text-lg break-words">{issue.title}</h3>
                          </div>
                          
                          <p className="text-muted-foreground break-words">{issue.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {issue.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <ClipboardList className="h-4 w-4" />
                              {issue.formName}
                            </div>
                          </div>

                          {/* Timestamps */}
                          <div className="flex flex-wrap gap-4 text-sm pt-2 border-t">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Opened:</span>
                              <span className="font-medium">
                                {format(new Date(issue.openedAt), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            {issue.closedAt && (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-success" />
                                <span className="text-muted-foreground">Closed:</span>
                                <span className="font-medium text-success">
                                  {format(new Date(issue.closedAt), "MMM d, yyyy 'at' h:mm a")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="flex lg:flex-col gap-2">
                          {issue.status === "open" ? (
                            <Button 
                              onClick={() => handleResolve(issue.id)}
                              className="gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Complete
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              onClick={() => handleReopen(issue.id)}
                              className="gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Reopen
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}