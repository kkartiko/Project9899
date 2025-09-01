"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Menu, X, Play, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Header Component with hide/reveal behavior
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current) {
          setIsHidden(true) // Hide on scroll down
        } else {
          setIsHidden(false) // Show on scroll up
        }
      } else {
        setIsHidden(false)
      }

      setIsScrolled(currentScrollY > 100)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest(".dropdown-container")) {
        setActiveDropdown(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [activeDropdown])

  const dropdownItems = {
    courses: [
      { label: "New course", desc: "Create engaging course content" },
      { label: "Manage courses", desc: "Organize and update your courses" },
      { label: "Course library", desc: "Browse available courses" },
    ],
    assessments: [
      { label: "Quiz builder", desc: "Build interactive quizzes" },
      { label: "Gradebook", desc: "Track student progress" },
      { label: "Quiz library", desc: "Access pre-made quizzes" },
    ],
    resources: [
      { label: "Materials", desc: "Upload and organize content" },
      { label: "Flashcards", desc: "Create study materials" },
      { label: "Discussions", desc: "Foster student engagement" },
    ],
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0B0D12]/80 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          Canvas
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {Object.entries(dropdownItems).map(([key, items]) => (
            <div key={key} className="relative dropdown-container">
              <button
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors capitalize hover:underline hover:underline-offset-4"
                onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                aria-expanded={activeDropdown === key}
                aria-controls={`dropdown-${key}`}
              >
                <span>{key}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === key ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === key && (
                <motion.div
                  id={`dropdown-${key}`}
                  className="absolute top-full left-0 mt-2 w-64 bg-[#0F1217] border border-gray-800 rounded-lg shadow-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  {items.map((item, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-b-0 focus:outline-none focus:bg-gray-800/50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      tabIndex={0}
                    >
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ willChange: "transform" }}>
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Started
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </motion.header>
  )
}

// Hero Section with improved parallax
const HeroSection = () => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 20]) // Exact 20px parallax as specified

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0B0D12] to-[#0F1217] flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm font-medium text-indigo-400 uppercase tracking-wider"
          >
            Modern Education Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: "easeOut" }} // 60ms stagger
            className="text-5xl lg:text-7xl font-bold text-white leading-tight"
            style={{ willChange: "transform, opacity" }}
          >
            Teach with
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {" "}
              confidence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }} // 60ms stagger
            className="text-xl text-gray-300 leading-relaxed max-w-lg"
          >
            Create engaging courses, build interactive quizzes, and track student progress with our all-in-one teaching
            toolkit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }} // Scale-in animation
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ willChange: "transform" }}>
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ willChange: "transform" }}>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                See Features
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Image with improved parallax */}
        <motion.div
          style={{ y, willChange: "transform" }}
          className="relative"
          whileHover={{ rotateY: 1, rotateX: 1 }} // Reduced tilt to 1-2 degrees
          transition={{ duration: 0.3 }}
        >
          <div className="relative bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-800">
            <Image
              src="/modern-education-dashboard-interface.png"
              alt="Canvas Education Platform Dashboard"
              width={500}
              height={600}
              className="rounded-lg shadow-2xl"
              loading="eager" // Eager loading for hero image
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12]/20 to-transparent rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Trusted By Section
const TrustedBySection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      className="py-16 bg-[#0F1217]"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400 mb-8">Trusted by educators at leading institutions</p>
        <div className="flex justify-center items-center space-x-12 opacity-50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-medium">Logo {i}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Features Grid Section
const FeaturesGrid = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    { title: "Flexible course builder", desc: "Create structured learning paths with drag-and-drop simplicity" },
    { title: "Engagement & tracking", desc: "Monitor student progress and participation in real-time" },
    { title: "Smart quiz creator", desc: "Build interactive assessments with auto-grading capabilities" },
    { title: "Resource management", desc: "Organize and share materials with seamless file handling" },
  ]

  return (
    <section ref={ref} className="py-24 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">All-in-one teaching toolkit</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to create, manage, and deliver exceptional educational experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Key Features Grid with masonry layout
const KeyFeaturesGrid = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    { type: "text", title: "Quiz builder", desc: "Create interactive assessments with multiple question types" },
    { type: "image", title: "Dashboard Analytics", src: "/analytics-dashboard.png" },
    { type: "text", title: "Accessibility tools", desc: "Built-in features for inclusive learning experiences" },
    { type: "text", title: "Resource uploads", desc: "Drag and drop files, videos, and presentations" },
    { type: "image", title: "Course Builder", src: "/course-builder-interface.png" },
    { type: "text", title: "Progress tracking", desc: "Real-time insights into student engagement and completion" },
  ]

  return (
    <section ref={ref} className="py-24 bg-[#0F1217]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Powerful features at your fingertips</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -2, scale: feature.type === "image" ? 1.02 : 1 }}
              className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden ${
                feature.type === "image" ? "aspect-[4/3]" : "p-6"
              }`}
              style={{ willChange: "transform" }}
            >
              {feature.type === "image" ? (
                <div className="relative w-full h-full">
                  <Image
                    src={feature.src! || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover rounded-2xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Individual Feature Callouts with alternating layouts
const FeatureCallouts = () => {
  const feature1Ref = useRef(null)
  const feature2Ref = useRef(null)
  const feature3Ref = useRef(null)
  const feature4Ref = useRef(null)
  const featureRefs = [feature1Ref, feature2Ref, feature3Ref, feature4Ref]

  const features = [
    {
      overline: "Smart Assessment",
      title: "Build quizzes in minutes",
      description:
        "Create multi-format assessments with auto-grading capabilities. Support for multiple choice, short answer, and essay questions with intelligent scoring.",
      image: "/placeholder.svg?key=mm2ow",
      reverse: false,
    },
    {
      overline: "Inclusive Design",
      title: "Accessible for all learners",
      description:
        "High contrast themes, readable fonts, and comprehensive alt text ensure your content reaches every student. Built-in accessibility tools meet WCAG standards.",
      image: "/placeholder.svg?key=5ttkg",
      reverse: true,
    },
    {
      overline: "Seamless Upload",
      title: "Share materials with one click",
      description:
        "Drag and drop notes, PDFs, videos, and presentations. Automatic file organization and instant sharing with your students.",
      image: "/placeholder.svg?key=j2kpf",
      reverse: false,
    },
    {
      overline: "Analytics Dashboard",
      title: "Track learning at a glance",
      description:
        "Monitor completion rates, quiz scores, and engagement metrics. Get insights into student progress with beautiful, actionable dashboards.",
      image: "/placeholder.svg?key=jrlbx",
      reverse: true,
    },
  ]

  return (
    <section className="py-24 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            ref={featureRefs[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`grid lg:grid-cols-2 gap-12 items-center ${feature.reverse ? "lg:grid-flow-col-dense" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className={feature.reverse ? "lg:col-start-2" : ""}
            >
              <div className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-4">
                {feature.overline}
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{feature.title}</h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">{feature.description}</p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className={feature.reverse ? "lg:col-start-1" : ""}
              whileHover={{ scale: 1.02 }}
              style={{ willChange: "transform" }}
            >
              <div className="relative bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-2xl p-8 border border-gray-800">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  width={500}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Pricing Section
const PricingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      price: isAnnual ? 8 : 10,
      tagline: "Perfect for individual educators",
      features: ["Up to 3 courses", "Basic quiz builder", "Student progress tracking", "Email support"],
    },
    {
      name: "Pro",
      price: isAnnual ? 16 : 20,
      tagline: "For professional educators",
      features: [
        "Unlimited courses",
        "Advanced quiz builder",
        "Detailed analytics",
        "Priority support",
        "Custom branding",
      ],
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-[#0F1217]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-300 mb-8">No contracts. Cancel anytime.</p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? "text-white" : "text-gray-400"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isAnnual ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? "text-white" : "text-gray-400"}`}>Annual</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.tagline}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white py-3 rounded-lg font-medium transition-all duration-200">
                  {index === 0 ? "Start now" : "Upgrade"}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I start a new course?",
      answer:
        'Simply click the "New Course" button in your dashboard and follow our step-by-step course builder. You can add lessons, upload materials, and set up assessments all in one place.',
    },
    {
      question: "What files can I upload?",
      answer:
        "You can upload PDFs, videos (MP4, MOV), images (JPG, PNG), presentations (PPT, PPTX), and documents (DOC, DOCX). Files up to 500MB are supported.",
    },
    {
      question: "Can I set quiz schedules?",
      answer:
        "Yes! You can schedule quizzes to open and close at specific dates and times, set time limits, and even randomize question order for each student.",
    },
    {
      question: "How do students find materials?",
      answer:
        "Students access all course materials through their personalized dashboard. Materials are organized by course and lesson, with search functionality to find specific content quickly.",
    },
    {
      question: "Can I monitor student progress?",
      answer:
        "Our analytics dashboard shows completion rates, quiz scores, time spent on materials, and engagement metrics for each student and across your entire class.",
    },
    {
      question: "Are courses accessible on mobile?",
      answer:
        "Yes, our platform is fully responsive and works seamlessly on all devices. Students can access courses, take quizzes, and view materials on their phones or tablets.",
    },
  ]

  return (
    <section ref={ref} className="py-24 bg-[#0B0D12]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Frequently asked questions</h2>
          <p className="text-xl text-gray-300">Everything you need to know about getting started</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-800 overflow-hidden"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                onClick={() => setOpenItem(openItem === index ? null : index)}
                aria-expanded={openItem === index}
                aria-controls={`faq-${index}`}
              >
                <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                <motion.div animate={{ rotate: openItem === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <motion.div
                id={`faq-${index}`}
                initial={false}
                animate={{
                  height: openItem === index ? "auto" : 0,
                  opacity: openItem === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Final CTA Section
const FinalCTASection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-br from-[#0F1217] via-indigo-900/20 to-violet-900/20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">Ready to transform your teaching?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of educators who are already creating amazing learning experiences with Canvas.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Start Course
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 bg-transparent"
              >
                Create Quiz
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#0B0D12] border-t border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Canvas
            </div>
            <p className="text-gray-400 text-sm">Empowering educators with modern teaching tools.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Assessments
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Social</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Dribbble
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">hello@canvas.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">© 2024 Canvas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function CanvasLanding() {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-white">
      <Header />
      <HeroSection />
      <TrustedBySection />
      <FeaturesGrid />
      <KeyFeaturesGrid />
      <FeatureCallouts />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
