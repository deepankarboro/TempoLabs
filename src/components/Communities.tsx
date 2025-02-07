import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Users, Plus } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  type: "genre" | "author";
  created_by: string;
  _count?: {
    members: number;
  };
}

export default function Communities() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityType, setNewCommunityType] = useState<"genre" | "author">(
    "genre",
  );

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data, error } = await supabase.from("communities").select(`
          *,
          _count { members: community_members(count) }
        `);

      if (error) console.error("Error fetching communities:", error);
      else setCommunities(data || []);
    };

    fetchCommunities();

    const subscription = supabase
      .channel("communities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "communities",
        },
        fetchCommunities,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createCommunity = async () => {
    if (!user || !newCommunityName.trim()) return;

    const { error } = await supabase.from("communities").insert({
      name: newCommunityName,
      type: newCommunityType,
      created_by: user.id,
    });

    if (error) console.error("Error creating community:", error);
    else setNewCommunityName("");
  };

  const joinCommunity = async (communityId: string) => {
    if (!user) return;

    const { error } = await supabase.from("community_members").insert({
      community_id: communityId,
      member_id: user.id,
    });

    if (error) console.error("Error joining community:", error);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Communities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
            placeholder="New community name..."
          />
          <Button onClick={createCommunity}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {communities.map((community) => (
              <Card key={community.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{community.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {community.type.charAt(0).toUpperCase() +
                        community.type.slice(1)}{" "}
                      Community
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {community._count?.members || 0}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => joinCommunity(community.id)}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
