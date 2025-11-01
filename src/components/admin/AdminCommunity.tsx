import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const AdminCommunity = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Resources</CardTitle>
          <CardDescription>
            Manage educational content, videos, and documents for the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Current Community Page</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The community page displays curated videos, documents, and links for IT and AI governance education.
            </p>
            <Link to="/community">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Community Page
              </Button>
            </Link>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">Content Management</h3>
            <p className="text-sm text-muted-foreground">
              To edit community resources (videos, documents, and links), update the content in:
              <code className="block mt-2 p-2 bg-background rounded text-xs">
                src/pages/Community.tsx
              </code>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Videos</h4>
              <p className="text-sm text-muted-foreground">
                Add or update educational video links and descriptions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Documents</h4>
              <p className="text-sm text-muted-foreground">
                Manage downloadable PDFs and documentation
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">External Links</h4>
              <p className="text-sm text-muted-foreground">
                Curate links to external resources and tools
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Featured Content</h4>
              <p className="text-sm text-muted-foreground">
                Highlight special topics like "AI in Governance"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommunity;
