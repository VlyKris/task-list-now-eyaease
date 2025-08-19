import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Rocket, Fire, Star, Clock, Plus, Shuffle, Magic, PartyPopper } from 'lucide-react';
import { TASK_CATEGORIES, PRIORITY_LEVELS } from '@/convex/schema';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required!'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  estimatedTime: z.number().min(1, 'Must be at least 1 minute!').optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CrazyTaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onRandomTask: () => void;
  isLoading?: boolean;
}

// Fun random task suggestions
const RANDOM_TASK_SUGGESTIONS = [
  "Dance like a robot 🤖",
  "Learn to whistle with your nose 🎵",
  "Do 10 push-ups on one hand 🤚",
  "Write a poem about socks 🧦",
  "Practice your best evil laugh 😈",
  "Learn to juggle with oranges 🍊",
  "Do a handstand (or try really hard) 🤸‍♂️",
  "Sing your favorite song backwards 🎤",
  "Draw a self-portrait with your eyes closed 👁️",
  "Learn to snap with your toes 🦶",
  "Practice your superhero landing pose 🦸‍♂️",
  "Make a paper airplane and fly it 🛩️",
  "Do a cartwheel (safely!) 🤸‍♀️",
  "Learn a magic trick 🪄",
  "Practice your best smile 😊",
];

// Fun category emojis
const CATEGORY_EMOJIS = {
  work: "💼",
  personal: "👤",
  fitness: "💪",
  creative: "🎨",
  learning: "📚",
  random: "🎲",
  crazy: "🎪",
};

// Fun priority emojis
const PRIORITY_EMOJIS = {
  chill: "😌",
  normal: "😐",
  urgent: "😰",
  emergency: "😱",
  apocalypse: "💀",
};

export default function CrazyTaskForm({ onSubmit, onRandomTask, isLoading }: CrazyTaskFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [formMode, setFormMode] = useState<'normal' | 'crazy' | 'insane'>('normal');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  // Rotate through random task suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % RANDOM_TASK_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Watch form values for dynamic effects
  const watchedTitle = watch('title');
  const watchedCategory = watch('category');
  const watchedPriority = watch('priority');

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    reset();
    setShowForm(false);
  };

  const generateRandomTask = () => {
    const randomTask = RANDOM_TASK_SUGGESTIONS[Math.floor(Math.random() * RANDOM_TASK_SUGGESTIONS.length)];
    const randomCategory = Object.keys(TASK_CATEGORIES)[Math.floor(Math.random() * Object.keys(TASK_CATEGORIES).length)];
    const randomPriority = Object.keys(PRIORITY_LEVELS)[Math.floor(Math.random() * Object.keys(PRIORITY_LEVELS).length)];
    const randomTime = Math.floor(Math.random() * 60) + 5;

    setValue('title', randomTask);
    setValue('category', randomCategory);
    setValue('priority', randomPriority);
    setValue('estimatedTime', randomTime);
  };

  const shuffleForm = () => {
    setIsShuffling(true);
    generateRandomTask();
    setTimeout(() => setIsShuffling(false), 500);
  };

  const getFormBackground = () => {
    switch (formMode) {
      case 'crazy':
        return 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600';
      case 'insane':
        return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 animate-pulse';
      default:
        return 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Action Button */}
      <motion.div
        className="text-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.button
          className={`${getFormBackground()} text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl border-2 border-white/20`}
          onClick={() => setShowForm(!showForm)}
          whileHover={{ 
            scale: 1.05, 
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                className="flex items-center gap-2"
              >
                <XCircle className="w-6 h-6" />
                Close Form
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -180 }}
                className="flex items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Create Crazy Task! 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Random Task Suggestion */}
      <motion.div
        className="text-center mb-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-white/80 text-sm mb-2">💡 Random Task Suggestion:</p>
        <motion.p
          key={currentSuggestion}
          className="text-white text-lg font-semibold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          {RANDOM_TASK_SUGGESTIONS[currentSuggestion]}
        </motion.button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.8 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className={`${getFormBackground()} text-white border-2 border-white/20 shadow-2xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Magic className="w-8 h-8" />
                  Create Your Task
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Form Mode Selector */}
                <div className="flex gap-2 mb-4">
                  {(['normal', 'crazy', 'insane'] as const).map((mode) => (
                    <motion.button
                      key={mode}
                      className={`px-4 py-2 rounded-lg font-semibold capitalize ${
                        formMode === mode 
                          ? 'bg-white text-purple-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      onClick={() => setFormMode(mode)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {mode === 'normal' && '😐'}
                      {mode === 'crazy' && '😜'}
                      {mode === 'insane' && '🤪'}
                      {mode}
                    </motion.button>
                  ))}
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                  {/* Task Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Task Title <span className="text-yellow-300">*</span>
                    </label>
                    <Input
                      {...register('title')}
                      placeholder="What crazy thing will you do today? 🎯"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      style={{
                        borderColor: watchedTitle ? '#FFD700' : 'rgba(255,255,255,0.3)',
                        boxShadow: watchedTitle ? '0 0 20px rgba(255,215,0,0.5)' : 'none',
                      }}
                    />
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-red-300 text-sm mt-1"
                      >
                        {errors.title.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Description (Optional)
                    </label>
                    <Textarea
                      {...register('description')}
                      placeholder="Add some details to your crazy task! 📝"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      rows={3}
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Category
                      </label>
                      <Select onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Choose category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TASK_CATEGORIES).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {CATEGORY_EMOJIS[key as keyof typeof CATEGORY_EMOJIS]} {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Priority Level
                      </label>
                      <Select onValueChange={(value) => setValue('priority', value)}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Choose priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {PRIORITY_EMOJIS[key as keyof typeof PRIORITY_EMOJIS]} {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Estimated Time (minutes)
                    </label>
                    <Input
                      {...register('estimatedTime', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      placeholder="How long will this take? ⏱️"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={shuffleForm}
                      disabled={isShuffling}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Shuffle className={`w-5 h-5 inline mr-2 ${isShuffling ? 'animate-spin' : ''}`} />
                      Shuffle! 🎲
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PartyPopper className="w-5 h-5 inline mr-2" />
                      Create Task! 🎉
                    </motion.button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Random Task Button */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={onRandomTask}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
          whileHover={{ 
            scale: 1.05,
            rotate: [0, -2, 2, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5 inline mr-2" />
          Generate Random Task! ⚡
        </motion.button>
      </motion.div>
    </div>
  );
}
