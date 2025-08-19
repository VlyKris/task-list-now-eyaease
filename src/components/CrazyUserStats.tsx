import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Zap, 
  Fire, 
  Rocket, 
  Crown, 
  Target, 
  TrendingUp,
  Award,
  Medal,
  Flame,
  Lightning
} from 'lucide-react';

interface UserStats {
  totalTasksCompleted: number;
  totalTasksCreated: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: number;
  favoriteEmoji?: string;
  level: number;
  experience: number;
}

interface CrazyUserStatsProps {
  stats: UserStats;
  className?: string;
}

// Achievement levels and their requirements
const ACHIEVEMENT_LEVELS = [
  { level: 1, name: "Task Rookie", emoji: "🌱", requirement: 0 },
  { level: 5, name: "Task Explorer", emoji: "🔍", requirement: 25 },
  { level: 10, name: "Task Warrior", emoji: "⚔️", requirement: 50 },
  { level: 15, name: "Task Master", emoji: "🎯", requirement: 100 },
  { level: 20, name: "Task Legend", emoji: "🏆", requirement: 200 },
  { level: 25, name: "Task God", emoji: "👑", requirement: 500 },
  { level: 30, name: "Task Overlord", emoji: "👹", requirement: 1000 },
];

// Streak achievements
const STREAK_ACHIEVEMENTS = [
  { streak: 3, name: "Getting Started", emoji: "🔥", color: "text-orange-500" },
  { streak: 7, name: "Week Warrior", emoji: "⚡", color: "text-yellow-500" },
  { streak: 14, name: "Fortnight Fighter", emoji: "💪", color: "text-green-500" },
  { streak: 30, name: "Monthly Master", emoji: "🌟", color: "text-blue-500" },
  { streak: 100, name: "Century Champion", emoji: "👑", color: "text-purple-500" },
  { streak: 365, name: "Yearly Legend", emoji: "💎", color: "text-pink-500" },
];

export default function CrazyUserStats({ stats, className }: CrazyUserStatsProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(stats.level);
  const [currentExp, setCurrentExp] = useState(stats.experience);
  const controls = useAnimation();

  // Calculate progress to next level
  const expForCurrentLevel = (currentLevel - 1) * 100;
  const expForNextLevel = currentLevel * 100;
  const progressToNextLevel = ((currentExp - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel)) * 100;

  // Get current achievement level
  const currentAchievement = ACHIEVEMENT_LEVELS.find(level => level.level === currentLevel) || ACHIEVEMENT_LEVELS[0];
  const nextAchievement = ACHIEVEMENT_LEVELS.find(level => level.level > currentLevel);

  // Get streak achievements
  const unlockedStreakAchievements = STREAK_ACHIEVEMENTS.filter(achievement => stats.currentStreak >= achievement.streak);
  const nextStreakAchievement = STREAK_ACHIEVEMENTS.find(achievement => achievement.streak > stats.currentStreak);

  useEffect(() => {
    // Animate stats on mount
    controls.start({
      scale: [0.8, 1.1, 1],
      opacity: [0, 1],
      transition: { duration: 1, ease: "easeOut" }
    });

    // Animate level up if needed
    if (currentLevel < stats.level) {
      controls.start({
        scale: [1, 1.3, 1],
        rotate: [0, 360, 0],
        transition: { duration: 1.5, ease: "easeOut" }
      });
      setCurrentLevel(stats.level);
    }

    // Animate experience gain
    if (currentExp < stats.experience) {
      const animateExp = () => {
        if (currentExp < stats.experience) {
          setCurrentExp(prev => Math.min(prev + 5, stats.experience));
          setTimeout(animateExp, 50);
        }
      };
      animateExp();
    }
  }, [stats, controls, currentLevel, currentExp]);

  const getLevelColor = (level: number) => {
    if (level >= 25) return 'from-purple-600 to-pink-600';
    if (level >= 20) return 'from-yellow-500 to-orange-500';
    if (level >= 15) return 'from-blue-600 to-purple-600';
    if (level >= 10) return 'from-green-500 to-blue-500';
    if (level >= 5) return 'from-yellow-400 to-green-500';
    return 'from-gray-500 to-blue-500';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 100) return 'from-purple-600 to-pink-600';
    if (streak >= 50) return 'from-yellow-500 to-orange-500';
    if (streak >= 20) return 'from-green-500 to-blue-500';
    if (streak >= 10) return 'from-blue-500 to-purple-500';
    if (streak >= 5) return 'from-yellow-400 to-green-500';
    return 'from-gray-500 to-blue-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Level and Experience Card */}
      <motion.div
        animate={controls}
        className="relative"
      >
        <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white border-2 border-white/20 shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                👑
              </motion.div>
              Level {currentLevel} - {currentAchievement.name}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {currentAchievement.emoji}
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            {/* Experience Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Experience: {currentExp} XP</span>
                <span>{nextAchievement ? `${expForNextLevel - currentExp} XP to next level` : 'Max Level!'}</span>
              </div>
              <div className="relative">
                <Progress 
                  value={progressToNextLevel} 
                  className="h-3 bg-white/20"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{ width: `${progressToNextLevel}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Next Level Preview */}
            {nextAchievement && (
              <motion.div
                className="bg-white/20 p-3 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-white/80">Next: {nextAchievement.name} {nextAchievement.emoji}</p>
                <p className="text-xs text-white/60">Complete {nextAchievement.requirement - stats.totalTasksCompleted} more tasks</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks Completed */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white border-2 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎯
                </motion.div>
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-4xl font-bold text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                {stats.totalTasksCompleted}
              </motion.div>
              <p className="text-center text-white/80 text-sm mt-2">
                {stats.totalTasksCreated} total created
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`bg-gradient-to-br ${getStreakColor(stats.currentStreak)} text-white border-2 border-white/20 shadow-xl`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  🔥
                </motion.div>
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-4xl font-bold text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {stats.currentStreak}
              </motion.div>
              <p className="text-center text-white/80 text-sm mt-2">
                Best: {stats.longestStreak} days
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Streak Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white border-2 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                🏆
              </motion.div>
              Streak Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STREAK_ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = stats.currentStreak >= achievement.streak;
                return (
                  <motion.div
                    key={achievement.streak}
                    className={`p-3 rounded-lg text-center border-2 ${
                      isUnlocked 
                        ? 'bg-white/20 border-white/40' 
                        : 'bg-white/10 border-white/20 opacity-50'
                    }`}
                    whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * STREAK_ACHIEVEMENTS.indexOf(achievement) }}
                  >
                    <div className="text-2xl mb-1">{achievement.emoji}</div>
                    <div className="text-sm font-semibold">{achievement.name}</div>
                    <div className="text-xs text-white/80">{achievement.streak} days</div>
                    {isUnlocked && (
                      <motion.div
                        className="absolute -top-2 -right-2"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Next Streak Goal */}
            {nextStreakAchievement && (
              <motion.div
                className="mt-4 p-3 bg-white/20 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-white/80">
                  Next goal: {nextStreakAchievement.name} {nextStreakAchievement.emoji}
                </p>
                <p className="text-xs text-white/60">
                  {nextStreakAchievement.streak - stats.currentStreak} more days to go!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements Toggle */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
          onClick={() => setShowAchievements(!showAchievements)}
          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.95 }}
        >
          {showAchievements ? 'Hide' : 'Show'} All Achievements 🎖️
        </motion.button>
      </motion.div>

      {/* All Achievements */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-2 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🎖️
                  </motion.div>
                  All Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACHIEVEMENT_LEVELS.map((achievement) => {
                    const isUnlocked = stats.totalTasksCompleted >= achievement.requirement;
                    return (
                      <motion.div
                        key={achievement.level}
                        className={`p-4 rounded-lg border-2 ${
                          isUnlocked 
                            ? 'bg-white/20 border-white/40' 
                            : 'bg-white/10 border-white/20 opacity-50'
                        }`}
                        whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * ACHIEVEMENT_LEVELS.indexOf(achievement) }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{achievement.emoji}</div>
                          <div>
                            <div className="font-semibold">{achievement.name}</div>
                            <div className="text-sm text-white/80">
                              Level {achievement.level} - {achievement.requirement} tasks
                            </div>
                          </div>
                          {isUnlocked && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            >
                              <Trophy className="w-6 h-6 text-yellow-300 fill-current" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
