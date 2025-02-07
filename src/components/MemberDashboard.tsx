import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Bell,
  Book,
  Calendar,
  Clock,
  MessageCircle,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Messages from "./Messages";
import Communities from "./Communities";

interface Loan {
  bookTitle: string;
  dueDate: string;
  isOverdue: boolean;
}

interface MemberDashboardProps {
  memberName?: string;
  memberEmail?: string;
  avatarUrl?: string;
  activeLoans?: Loan[];
  notifications?: number;
}

const MemberDashboard = ({
  memberName = "Sarah Johnson",
  memberEmail = "sarah.j@example.com",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  activeLoans = [
    { bookTitle: "The Great Gatsby", dueDate: "2024-04-15", isOverdue: false },
    { bookTitle: "1984", dueDate: "2024-03-30", isOverdue: true },
    {
      bookTitle: "Pride and Prejudice",
      dueDate: "2024-04-20",
      isOverdue: false,
    },
  ],
  notifications = 2,
}: MemberDashboardProps) => {
  return (
    <div className="w-[400px] h-full bg-white p-4 border-l border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={memberName} />
            <AvatarFallback>{memberName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{memberName}</h3>
            <p className="text-sm text-gray-500">{memberEmail}</p>
          </div>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-500" />
          {notifications > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {notifications}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="loans" className="flex-1">
            <Book className="h-4 w-4 mr-2" />
            Loans
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Communities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Book className="h-5 w-5" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {activeLoans.map((loan, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{loan.bookTitle}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {loan.dueDate}</span>
                          </div>
                        </div>
                        {loan.isOverdue && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Messages />
        </TabsContent>

        <TabsContent value="communities">
          <Communities />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDashboard;
