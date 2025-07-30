'use client'

import { motion } from 'framer-motion'
import { Play, Shield, Eye, BookOpen, Clock, Star, Heart, Zap } from 'lucide-react'

export function LandingSection() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description: "No YouTube login required. Your data stays private and local."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Distraction-Free",
      description: "Focus on what matters with a clean, organized interface."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Smart Organization",
      description: "Categorize and tag videos for better learning management."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Track your watching progress with status indicators."
    }
  ]

  const useCases = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Learning Playlists",
      description: "Organize educational content by topic or course"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Weekend Watchlist",
      description: "Save videos for your free time"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Multi-Topic Management",
      description: "Manage different interests in separate playlists"
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Create Playlists",
      description: "Organize your videos into themed collections"
    },
    {
      number: "2",
      title: "Add Videos",
      description: "Paste YouTube URLs to automatically fetch video details"
    },
    {
      number: "3",
      title: "Track Progress",
      description: "Mark videos as to-watch, watching, or watched"
    },
    {
      number: "4",
      title: "Enjoy Learning",
      description: "Focus on content without distractions"
    }
  ]

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose DevList?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your YouTube watching experience with powerful organization tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you &apos; re a student, professional, or casual learner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Zap className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Organized?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Start managing your YouTube videos like a pro
            </p>
            <div className="flex items-center justify-center gap-4 text-sm opacity-75">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                <span>No Login Required</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            Built with ❤️ by Keshav Sandhu
          </p>
          <p className="text-sm text-gray-500">
            DevList - Organize your YouTube learning journey
          </p>
        </div>
      </footer>
    </div>
  )
} 