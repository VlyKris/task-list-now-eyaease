import React, { useState, useEffect } from 'react';
import { Protected } from "@/lib/protected-page";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Zap, 
  Trophy, 
  Star, 
  Fire, 
  Rocket, 
  Target, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Sparkles
} from "lucide-react";

// Import our crazy components
import CrazyBackground from "@/components/CrazyBackground";
import TaskCard3D from "@/components/TaskCard3D";
import CrazyTaskForm from "@/components/CrazyTaskForm";
import CrazyUserStats from "@/components/CrazyUserStats";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "category">("created");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data
  const tasks = useQuery(api.tasks.getUserTasks, { userId: user?._id || "" });
  const completedTasks = useQuery(api.tasks.getUserCompletedTasks, { userId: user?._id || "" });
  const pendingTasks = useQuery(api.tasks.getUserPendingTasks, { userId: user?._id || "" });
  const userStats = useQuery(api.tasks.getUserStats, { userId: user?._id || "" });

  // Mutations
  const createTask = useMutation(api.tasks.createTask);
  const createRandomTask = useMutation(api.tasks.createRandomTask);
  const completeTask = useMutation(api.tasks.completeTask);
  const uncompleteTask = useMutation(api.tasks.uncompleteTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === "all" || task.category === filterCategory;
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created":
          return b.createdAt - a.createdAt;
        case "priority":
          const priorityOrder = { apocalypse: 5, emergency: 4, urgent: 3, normal: 2, chill: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, filterCategory, filterPriority, sortBy]);

  // Handle task creation
  const handleCreateTask = async (data: any) => {
    if (!user?._id) return;
    
    setIsLoading(true);
    try {
      await createTask({
        ...data,
        userId: user._id,
      });
      toast.success("🎉 Crazy task created successfully!");
    } catch (error) {
      toast.error("❌ Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle random task creation
  const handleRandomTask = async () => {
    if (!user?._id) return;
    
    setIsLoading(true);
    try {
      await createRandomTask({ userId: user._id });
      toast.success("🎲 Random crazy task generated!");
    } catch (error) {
      toast.error("❌ Failed to generate random task");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task completion
  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask({ taskId });
      toast.success("🎯 Task completed! You're on fire! 🔥");
    } catch (error) {
      toast.error("❌ Failed to complete task");
    }
  };

  // Handle task uncompletion
  const handleUncompleteTask = async (taskId: string) => {
    try {
      await uncompleteTask({ taskId });
      toast.info("🔄 Task marked as incomplete");
    } catch (error) {
      toast.error("❌ Failed to update task");
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({ taskId });
      toast.success("🗑️ Task deleted successfully");
    } catch (error) {
      toast.error("❌ Failed to delete task");
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      await updateTask({ taskId, ...updates });
      toast.success("✏️ Task updated successfully");
    } catch (error) {
      toast.error("❌ Failed to update task");
    }
  };

  // Get unique categories and priorities for filters
  const categories = React.useMemo(() => {
    if (!tasks) return [];
    const uniqueCategories = new Set(tasks.map(task => task.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [tasks]);

  const priorities = React.useMemo(() => {
    if (!tasks) return [];
    const uniquePriorities = new Set(tasks.map(task => task.priority).filter(Boolean));
    return Array.from(uniquePriorities);
  }, [tasks]);

  if (!user) {
    return (
      <Protected>
        <div>Loading...</div>
      </Protected>
    );
  }

  return (
    <Protected>
      <CrazyBackground mode="2d">
        <div className="min-h-screen p-6">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎪 CRAZY TASK LIST! 🎪
            </motion.h1>
            <motion.p
              className="text-xl text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Welcome back, {user.name || "Task Master"}! Ready to get CRAZY? 🚀
            </motion.p>
          </motion.div>

          {/* Quick Stats Banner */}
          {userStats && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-2 border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold">{userStats.totalTasksCompleted}</div>
                      <div className="text-sm text-white/80">Completed</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{userStats.totalTasksCreated}</div>
                      <div className="text-sm text-white/80">Created</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{userStats.currentStreak}</div>
                      <div className="text-sm text-white/80">Day Streak 🔥</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">Level {userStats.level}</div>
                      <div className="text-sm text-white/80">{userStats.experience} XP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Task Creation Form */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CrazyTaskForm
              onSubmit={handleCreateTask}
              onRandomTask={handleRandomTask}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <TabsList className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
                <TabsTrigger 
                  value="tasks" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  🎯 Active Tasks ({pendingTasks?.length || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  ✅ Completed ({completedTasks?.length || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  🏆 Stats & Achievements
                </TabsTrigger>
              </TabsList>
            </motion.div>

            {/* Active Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              {/* Filters and Search */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/60"
                    />
                  </div>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                  >
                    <option value="all">All Priorities</option>
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                  >
                    <option value="created">Sort by Created</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </motion.div>

              {/* Tasks Grid */}
              {filteredTasks.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No tasks found!</h3>
                  <p className="text-white/80 mb-6">Time to create some crazy tasks! 🚀</p>
                  <Button
                    onClick={handleRandomTask}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Random Task!
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredTasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{ 
                          delay: index * 0.1, 
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200
                        }}
                        layout
                      >
                        <TaskCard3D
                          task={task}
                          onComplete={handleCompleteTask}
                          onDelete={handleDeleteTask}
                          onUpdate={handleUpdateTask}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* Completed Tasks Tab */}
            <TabsContent value="completed" className="space-y-6">
              {completedTasks && completedTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white border-2 border-white/20 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{task.emoji}</span>
                            {task.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {task.description && (
                              <p className="text-white/80">{task.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {task.category && (
                                <Badge variant="secondary" className="bg-white/20 text-white">
                                  {task.category}
                                </Badge>
                              )}
                              {task.priority && (
                                <Badge variant="secondary" className="bg-white/20 text-white">
                                  {task.priority}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Clock className="w-4 h-4" />
                              Completed {new Date(task.completedAt || 0).toLocaleDateString()}
                            </div>
                            <Button
                              onClick={() => handleUncompleteTask(task._id)}
                              variant="outline"
                              className="w-full border-white/30 text-white hover:bg-white/20"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Mark Incomplete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No completed tasks yet!</h3>
                  <p className="text-white/80">Complete some tasks to see them here! 🚀</p>
                </motion.div>
              )}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              {userStats ? (
                <CrazyUserStats stats={userStats} />
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stats loading...</h3>
                  <p className="text-white/80">Creating some tasks will generate your stats! 🎉</p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>

          {/* Floating Action Button */}
          <motion.button
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-2xl border-2 border-white/20 flex items-center justify-center text-2xl"
            onClick={handleRandomTask}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            <Zap className="w-8 h-8" />
          </motion.button>
        </div>
      </CrazyBackground>
    </Protected>
  );
}
