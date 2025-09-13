//About us, Help, Contact, Privacy policy, FAQ's, Change Password,

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shimmer/shimmer.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/profile_service.dart';
import '../services/notification_service.dart';
import '../services/chat_service.dart';
import '../models/notification.dart';
import 'Forms/step1.dart';
import 'Forms/step2form/generic_picker.dart';
import 'profile_details_screen.dart';
import 'activity_screen.dart';
import 'agent_activity_screen.dart';
import 'gallery_screen.dart';
import 'interest_details_screen.dart';
import 'notification_screen.dart';
import 'all_profiles_screen.dart';
import 'individual_chat_screen.dart';
import 'settings_screen.dart';
import 'report_bugs_page.dart';
import 'contact_us_page.dart';
import 'about_us_page.dart';
import 'terms_conditions_page.dart';
import 'privacy_policy_page.dart';

Future<void> saveLastScreen(String screenName) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('last_screen', screenName);
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  // Animation controllers for smooth transitions
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late AnimationController _shortlistAnimationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _shortlistScaleAnimation;

  // User data from backend
  bool isProfileComplete = false;
  String userName = 'User';
  String userGender = 'unknown'; // User ka gender for filtering
  String currentUserId = '1'; // Real user ID from database
  double profilePercentage = 0.0; // Profile completion percentage from backend
  String? userPhoto; // User ka profile photo URL

  // Agent detection - yeh check karega ki current user agent hai ya normal user
  bool isAgent = false; // Agent hai ya nahi
  int? agentId; // Agent ID agar agent hai toh
  bool isAgentImpersonating =
      false; // Agent user ke roop mein login hai ya nahi
  int? originalAgentId; // Original agent ID for returning back

  // Loading states
  bool isLoadingTrending = true;
  bool isLoadingRecommended = true;
  bool isLoadingLatest = true;

  // Drawer menu state
  bool isProfileMenuExpanded = false; // My Profile submenu ke liye
  bool isHelpSupportMenuExpanded = false; // Help & Support submenu ke liye

  // Profile data from backend
  List<Map<String, String?>> trendingProfiles = [];
  List<Map<String, String?>> recommendations = [];
  List<Map<String, String?>> latestProfiles = [];

  // Track shortlisted users for agents and normal users
  Set<String> shortlistedUserIds = {};

  // Notification count for Messages tab
  int unreadMessageCount = 0;

  // Yeh lists step3_1.dart se copy ki gayi hain (for exact same options)
  final List<String> _educationList = [
    'PhD in Science (Doctor of Philosophy in Science)',
    "Master's Degree",
    "Bachelor's Degree",
    'Diploma',
    'Trade School/TTC (Technical Training College)/ITI (Industrial Training Institute)',
    'Islamic Education',
    'Higher Secondary School (12th)',
    'Less than High School',
    'Secondary School (10th)',
    'Never been to School/Never Studied',
    'Agriculture',
    'Mass Communication',
    'D.Pharm (Diploma in Pharmacy)',
    'Drafting/Design',
    'Religious Education',
    'Nursing',
    'Medicine (Other)',
    'Administrative Services',
    'Social Work',
    'Philosophy',
    'Aeronautical Engineering',
    'Fine Arts',
    'Travel & Tourism',
    'Shipping',
    'Advertising/Marketing',
    'Office Administration',
    'Paramedical',
    'Medicine (Allopathic)',
    'Law',
    'Home Science',
    'Finance',
    'Fashion',
    'Education',
    'Computers/IT (Information Technology)',
    'Commerce',
    'Arts',
    'Armed Forces',
    'Architecture',
    'Administration/Management',
    'Engineering/Technology',
    'Veterinary Science',
    'Biotechnology',
    'Visual Communication',
    'Radiology',
    'Cardiac Care Technology',
    'Health and Safety',
    'Business Administration',
    'Design (B.Design/M.Design - Bachelor/Master of Design)',
    'Management (MFM - Master of Fashion Management, MBA - Master of Business Administration)',
    'Engineering (B.Tech - Bachelor of Technology, M.Tech - Master of Technology, B.E - Bachelor of Engineering, M.E - Master of Engineering, MS - Master of Science)',
    'Medical Laboratory Technology',
    'Pharmacy (B.Pharm - Bachelor of Pharmacy, M.Pharm - Master of Pharmacy, Pharm.D - Doctor of Pharmacy)',
    'Biochemistry/Bioengineering',
    'Law (LLB - Bachelor of Laws, LLM - Master of Laws, Course in Legal)',
    'Chartered Accountancy (CA, CA Inter - Chartered Accountant, CA Intermediate)',
    'Cost Accounting (ICWA - Institute of Cost and Works Accountants)',
    'Company Secretary (CS)',
    'Chartered Financial Analyst (CFA)',
    'Public Administration (IAS - Indian Administrative Service, IPS - Indian Police Service, IRS - Indian Revenue Service)',
    'Civil Services (IES - Indian Engineering Services)',
    'Fashion Management (MFM - Master of Fashion Management, BFM - Bachelor of Fashion Management)',
    'Management (PGDM - Post Graduate Diploma in Management, MBA - Master of Business Administration)',
    'Media Studies/Visual Arts',
    'Clinical Psychology',
    'Geography/Geology',
    'Environmental Science',
    'Aerospace Engineering',
    'Education (B.Ed - Bachelor of Education, M.Ed - Master of Education)',
    'Bachelor of Law (BL)',
    'Bachelor of Engineering (B.E)',
    'Bachelor of Science (BSc)',
    'MSc (Master of Science) Computer Science/IT (Information Technology)',
    'MSc Health and Safety',
    'MSc Radiology',
    'MSc Biotechnology',
    'MSc Nursing',
    'Master of Law (LLM)',
    'Master of Veterinary Science',
    'MPhil (Master of Philosophy)',
    'MD/MS (Medical Doctor/Master of Surgery)',
    'MDS (Master of Dental Surgery)',
    'MPT (Master of Physiotherapy)',
    'MCA (Master of Computer Applications)',
    'BPT (Bachelor of Physiotherapy)',
    'Aalimah',
    'Aalim',
    'Hafizah',
    'Hafiz',
    'PhD in Islamic Studies (Doctor of Philosophy in Islamic Studies)',
    'Artificial Intelligence (AI)',
    'Data Science',
    'Cybersecurity',
    'Digital Marketing',
    'Blockchain Technology',
    'Cloud Computing',
    'Robotics',
    'Game Development',
    'Animation',
    'Graphic Design',
    'Interior Design',
    'Film Studies',
    'Journalism',
    'Public Relations',
    'Hospitality Management',
    'Event Management',
    'Culinary Arts',
    'Sports Management',
    'Education Administration',
    'Early Childhood Education',
    'Special Education',
    'Occupational Therapist',
    'Speech-Language Pathology',
    'Dentistry (BDS - Bachelor of Dental Surgery, MDS - Master of Dental Surgery)',
    'Optometry',
    'Physiotherapy',
    'Biotechnology Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Environmental Engineering',
    'Nuclear Engineering',
    'Robotics Engineering',
    'Materials Science Engineering',
    'Petroleum Engineering',
    'Mining Engineering',
    'Structural Engineering',
    'Computer Engineering',
    'Software Engineering',
    'Data Engineering',
    'Applied Mathematics',
    'Actuarial Science',
    'Statistics',
    'Public Health',
    'Epidemiology',
    'Biomedical Science',
    'Microbiology',
    'Pharmacology',
    'Toxicology',
    'Medical Sciences',
    'Nuclear Medicine',
    'Psychiatry',
    'Neurology',
    'Cardiology',
    'Gastroenterology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Obstetrics and Gynecology',
    'Emergency Medicine',
    'Anesthesiology',
    'Ophthalmology',
    'Radiology',
    'Veterinary Medicine',
    'Human Resource Management',
    'Supply Chain Management',
    'Project Management',
    'International Relations',
    'Political Science',
    'Sociology',
    'Psychology',
    'Anthropology',
    'Linguistics',
    'Theology/Religious Studies',
    'History',
    'Literature',
    'Philosophy',
    'Social Sciences',
    'Human Development',
    'Geography',
    'Geophysics',
    'Meteorology',
    'Urban Planning',
    'Renewable Energy',
    'Sustainable Development',
    'Environmental Policy',
    'International Business',
    'Entrepreneurship',
    'Marketing Research',
    'Risk Management',
    'International Law',
    'Human Rights Law',
    'Maritime Studies',
    'Forensic Science',
    'Criminology',
    'Fire Safety Engineering',
    'Industrial Design',
    'Fashion Design',
    'Textile Engineering',
    'Marine Engineering',
    'Others',
    'Not Applicable/Not Studied/Never Studied',
  ];
  final List<String> _professionList = [
    'Accountant',
    'Acting Professional',
    'Actor',
    'Administrator',
    'Administration Professional',
    'Advertising Professional',
    'Advertiser',
    'Air Hostess',
    'Airline Professional',
    'Agriculture',
    'Airforce',
    'Architect',
    'Artist',
    'Assistant Professor',
    'Audiologist',
    'Auditor',
    'Bank Job',
    'Bank Officer',
    'Bank Staff',
    'Beautician',
    'Biologist/Botanist',
    'Business Person',
    'Captain',
    'CEO/CTO/President',
    'Chemist',
    'Civil Engineer',
    'Civil Service',
    'Clerical Official',
    'Clinical Pharmacist',
    'Company Secretary',
    'Computer Engineer',
    'Computer Programmer',
    'Consultant',
    'Contractor',
    'Content Creator',
    'Counsellor',
    'Creative Person',
    'Customer Support Professional',
    'Data Analyst and Content Strategist',
    'Defence Employee',
    'Dentist',
    'Designer',
    'Director/Chairman',
    'Doctor',
    'Domestic Helper',
    'Economist',
    'Engineer',
    'Engineer (Civil)',
    'Engineer (Electrical)',
    'Engineer (Mechanical)',
    'Engineer (Project)',
    'Entertainment Professional',
    'Event Manager',
    'Event Management Professional',
    'Executive',
    'Factory Worker',
    'Farmer',
    'Fashion Designer',
    'Finance Professional',
    'Food Technology',
    'Government Employee',
    'Government Official',
    'Graphic Designer',
    'Gulf Based',
    'Hair Dresser',
    'Health Care Professional',
    'Hospitality',
    'Hotel & Restaurant Professional',
    'Hotel Professional',
    'Human Resource Professional',
    'HSE Officer',
    'Interior Designer',
    'Influencer',
    'Insurance Advisor',
    'Insurance Agent',
    'Investment Professional',
    'IT/Telecom Professional',
    'Islamic Activities',
    'Islamic Dawah',
    'Islamic Scholar',
    'Islamic Teacher',
    'Journalist',
    'Law',
    'Lawyer',
    'Lecturer',
    'Legal Professional',
    'Librarian',
    'Logistics',
    'Manager',
    'Marketing Professional',
    'Media Professional',
    'Medical Professional',
    'Medical Representative',
    'Medical Transcriptionist',
    'Merchant Naval Officer',
    'Microbiologist',
    'Military',
    'Nanny/Child Care',
    'Navy',
    'Non-mainstream Professional',
    'Nurse',
    'NRI',
    'Occupation Therapist',
    'Office Staff',
    'Optician',
    'Optometrist',
    'Pharmacist',
    'Physician Assistant',
    'Physician',
    'Pilot',
    'Police',
    'Priest',
    'Product Professional',
    'Professor',
    'Project Manager',
    'Public Relations Professional',
    'Real Estate Professional',
    'Research Scholar',
    'Retail Professional',
    'Sales Professional',
    'Scientist',
    'Self-employed Person',
    'Social Worker',
    'Software Consultant',
    'Speech Therapist',
    'Sportsman',
    'Supervisor',
    'Teacher',
    'Technician',
    'Technical Staff',
    'Tiktoker',
    'Tour Guide',
    'Trainer',
    'Transportation Professional',
    'Tutor',
    'Unemployed',
    'Veterinary Doctor',
    'Videographer',
    'Web Designer',
    'Web Developer',
    'Wholesale Businessman',
    'Writer',
    'Zoologist',
    'NA',
    'Other',
  ];

  // Marital status options gender ke hisaab se dynamic banate hain
  List<String> _getMaritalStatusOptionsForFilter() {
    // Default: female ke liye Married bhi dikhana hai
    if (userGender.toLowerCase() == 'male') {
      return ['Single', 'Divorced', 'Khula', 'Widowed'];
    } else {
      return ['Single', 'Married', 'Divorced', 'Khula', 'Widowed'];
    }
  }

  // Filter state variables
  RangeValues _filterAgeRange = const RangeValues(18, 40);
  String? _filterCountry;
  String? _filterState;
  String? _filterCity;
  String? _filterProfession;
  String? _filterEducation;
  String? _filterMaritalStatus;
  bool _isFilterApplied = false;

  // Filtered profiles - jab filter lagta hai toh yahan store karenge
  List<Map<String, String?>> _filteredProfiles = [];
  bool _isLoadingFilter = false; // Filtered data loading state

  // Location field controller for filter
  final TextEditingController _filterLocationController =
      TextEditingController();

  int _notificationCount = 0;
  List<AppNotification> _notifications = [];

  @override
  void initState() {
    super.initState();

    // Initialize animation controllers
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    // Initialize shortlist animation controller
    _shortlistAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _shortlistScaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.3,
    ).animate(CurvedAnimation(
      parent: _shortlistAnimationController,
      curve: Curves.elasticOut,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    ));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeOutCubic,
    ));

    // Start animations
    _fadeController.forward();
    _slideController.forward();

    saveLastScreen('homepage');
    _saveHomepageStatus();

    // Initialize app data asynchronously
    _initializeAppData();
    _fetchNotifications();
    _loadUnreadMessageCount();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Agar arguments mein selectedIndex aaye toh wahi tab select karo
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is Map && args['selectedIndex'] is int) {
      setState(() {
        _selectedIndex = args['selectedIndex'];
      });
    }

    // Refresh unread message count when returning to homepage
    _loadUnreadMessageCount();

    // Refresh shortlist status when returning to homepage
    _refreshShortlistData();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _shortlistAnimationController.dispose();
    super.dispose();
  }

  Future<void> _fetchNotifications() async {
    try {
      final notifs =
          await NotificationService.fetchNotifications(currentUserId);
      setState(() {
        _notifications = notifs;
        _notificationCount = notifs.length;
      });
    } catch (e) {
      debugPrint('Failed to fetch notifications: $e');
    }
  }

  // Load unread message count for Messages tab badge
  Future<void> _loadUnreadMessageCount() async {
    try {
      final count = await ChatService.getTotalUnreadCount();
      setState(() {
        unreadMessageCount = count;
      });
    } catch (e) {
      debugPrint('Failed to load unread message count: $e');
    }
  }

  // Ye function SharedPreferences mein save karta hai ki user homepage par aa gaya hai
  Future<void> _saveHomepageStatus() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('homepage_visited', true);
  }

  // Initialize app data asynchronously
  Future<void> _initializeAppData() async {
    try {
      await _loadCurrentUserId();
    } catch (e) {
      // Handle initialization error silently in production
    }
  }

  // Refresh shortlist data when returning to homepage
  Future<void> _refreshShortlistData() async {
    try {
      if (isAgent) {
        await _loadShortlistedUsers();
      } else {
        await _loadNormalUserShortlistedUsers();
      }
    } catch (e) {
      // Handle error silently in production
    }
  }

  // Manual refresh method that can be called from UI
  Future<void> _manualRefreshShortlist() async {
    try {
      await _refreshShortlistData();
      setState(() {}); // Trigger UI rebuild
    } catch (e) {
      // Handle error silently in production
    }
  }

  // Load actual user ID from SharedPreferences (registration se saved)
  Future<void> _loadCurrentUserId() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedUserId = prefs.getInt('user_id'); // Registration se saved ID
      final savedAgentId = prefs.getInt('agent_id'); // Agent ID check karo
      final isAgentImpersonatingFlag =
          prefs.getBool('is_agent_impersonating') ??
              false; // Agent impersonating check

      // Agent impersonating logic - agar agent user ke roop mein login hai
      if (isAgentImpersonatingFlag && savedUserId != null) {
        final originalAgentIdValue = prefs.getInt('original_agent_id');
        setState(() {
          isAgent = false; // Agent mode band karo, user mode on karo
          agentId = null;
          currentUserId = savedUserId.toString(); // User ID use karo
          isAgentImpersonating = true;
          originalAgentId = originalAgentIdValue;
        });
      }
      // Normal agent detection logic - agar agent_id hai toh user agent hai
      else if (savedAgentId != null && savedAgentId > 0) {
        setState(() {
          isAgent = true;
          agentId = savedAgentId;
          currentUserId =
              savedAgentId.toString(); // Agent ke liye agent ID use karo
        });
      } else if (savedUserId != null) {
        setState(() {
          isAgent = false;
          currentUserId = savedUserId.toString();
        });
      } else {
        // Fallback - Check if user is logged in via Firebase
        // For now, keep default '1' but log this scenario
      }

      // Ab proper user ID ke saath initialization karo
      await _initializeApp();
    } catch (e) {
      // Handle error silently in production
      // Fallback to default and continue
      await _initializeApp();
    }
  }

  // App initialization with proper user ID
  Future<void> _initializeApp() async {
    // Test backend connection first
    await _testBackendConnection();

    // Check if user is properly authenticated
    if (await _isUserAuthenticated()) {
      // Load user data and profiles with actual user ID
      await _loadUserData();
      await _loadProfileData();

      // Load shortlisted users for both agents and normal users
      if (isAgent) {
        await _loadShortlistedUsers();
      } else {
        await _loadNormalUserShortlistedUsers();
      }
      debugPrint(
          '✅ Shortlist loading completed. Total shortlisted: ${shortlistedUserIds.length}');
    } else {
      // User not authenticated, handle accordingly
      _handleUnauthenticatedUser();
    }
  }

  // Check if user is properly authenticated
  Future<bool> _isUserAuthenticated() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getInt('user_id');
      final agentId = prefs.getInt('agent_id');

      // Check if user ID or agent ID exists and is valid
      if ((userId != null && userId > 0) || (agentId != null && agentId > 0)) {
        return true;
      }

      return false;
    } catch (e) {
      debugPrint('Error checking authentication: $e');
      return false;
    }
  }

  // Handle unauthenticated user
  void _handleUnauthenticatedUser() {
    debugPrint('⚠️ User not authenticated, redirecting to login...');

    // Show message and redirect to login
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Please login to continue',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.orange,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );

        // Navigate to login screen
        Navigator.of(context).pushNamedAndRemoveUntil(
          '/login', // Replace with your login route
          (route) => false,
        );
      }
    });
  }

  // Return to agent mode from impersonating user
  Future<void> _returnToAgentMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Clear user tokens and impersonation flags
      await prefs.remove('user_access_token');
      await prefs.remove('user_refresh_token');
      await prefs.remove('is_agent_impersonating');

      // Restore agent tokens and ID
      final originalAgentId = prefs.getInt('original_agent_id');
      final agentToken = prefs.getString('agent_token');

      if (originalAgentId != null && agentToken != null) {
        // Set agent mode back
        await prefs.setInt('agent_id', originalAgentId);
        await prefs.setBool('is_agent_mode', true);

        // Clear original agent ID
        await prefs.remove('original_agent_id');

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ Returned to Agent Mode'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
          ),
        );

        // Navigate to agent activity screen
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/agent_activity',
          (route) => false,
        );
      } else {
        throw Exception('Agent session not found');
      }
    } catch (e) {
      debugPrint('❌ ERROR: Failed to return to agent mode: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text('❌ Failed to return to agent mode. Please login again.'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );

      // Navigate to agent login
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/agent_login',
        (route) => false,
      );
    }
  }

  // Test backend connection - IP address verification
  Future<void> _testBackendConnection() async {
    try {
      final isConnected = await ProfileService.testConnection();
      debugPrint('Backend connection status: $isConnected');

      if (!isConnected) {
        debugPrint(
            'Warning: Backend connection failed - Check ngrok URL https://mehrammatchbackend-production.up.railway.app');
      } else {
        debugPrint('✅ Backend connected successfully!');
      }
    } catch (e) {
      debugPrint('Backend connection test error: $e');
    }
  }

  // Load user data from backend
  Future<void> _loadUserData() async {
    try {
      if (isAgent) {
        // Agent ke liye agent data load karo
        try {
          final agentProfile =
              await ProfileService.fetchAgentProfile(agentId: currentUserId);
          setState(() {
            userName = agentProfile['name'] ?? 'Agent';
            userGender = 'agent'; // Agent ke liye special gender
            isProfileComplete = true; // Agent ke liye profile complete
            profilePercentage = 100.0; // Agent ke liye 100% complete
            userPhoto = agentProfile['upload_photo'];
            // Agent mode ke liye currentUserId ko agent_ prefix ke saath set karo
            currentUserId = 'agent_$currentUserId';
          });
        } catch (e) {
          setState(() {
            userName = 'Agent';
            userGender = 'agent';
            isProfileComplete = true;
            profilePercentage = 100.0;
            userPhoto = null;
          });
        }

        debugPrint('Agent data loaded: $userName');
        _logGenderFiltering();
      } else {
        // Normal user ke liye user profile load karo
        final userProfile =
            await ProfileService.fetchUserProfile(userId: currentUserId);

        if (userProfile != null && mounted) {
          setState(() {
            userName = userProfile['name'] ?? 'User';
            userGender = userProfile['gender'] ?? 'unknown';
            isProfileComplete = userProfile['profile_completed'] ?? false;
            profilePercentage = userProfile['profile_percentage'] ?? 0.0;
            String? photoPath =
                userProfile['upload_photo'] ?? userProfile['photo'];
            if (photoPath != null && photoPath.startsWith('/media/')) {
              userPhoto = 'https://mehrammatchbackend-production.up.railway.app' + photoPath;
            } else {
              userPhoto = photoPath;
            }
          });

          // Gender info log karte hain for debugging
          debugPrint('User loaded: $userName, Gender: $userGender');
          _logGenderFiltering();
        }
      }
    } catch (e) {
      debugPrint('Error loading user data: $e');
    }
  }

  // Gender filtering information display karne ke liye
  void _logGenderFiltering() {
    if (isAgent) {
    } else {
      String oppositeGender =
          userGender.toLowerCase() == 'male' ? 'female' : 'male';
      String showingProfiles =
          userGender.toLowerCase() == 'male' ? 'Female' : 'Male';
    }
  }

  // Gender-based subtitle generate karne ke liye
  String _getGenderFilteredSubtitle(String baseText) {
    if (isAgent) {
      return '$baseText members on our platform (All genders).';
    }

    if (userGender == 'unknown') {
      return '$baseText members on our platform.';
    }

    String genderText = userGender.toLowerCase() == 'male' ? 'female' : 'male';
    return '$baseText $genderText members according to Islamic values.';
  }

  // Verify karte hain ki backend se correct gender ki profiles aa rahi hain
  void _verifyGenderFiltering(
      String sectionName, List<Map<String, dynamic>> profiles) {
    if (profiles.isEmpty) {
      debugPrint('⚠️ $sectionName: No profiles received');
      return;
    }

    if (isAgent) {
      debugPrint('=== $sectionName AGENT GENDER VERIFICATION ===');
      debugPrint('User Type: Agent (ID: $agentId)');
      debugPrint('Expected: ALL GENDERS (Male & Female profiles)');
      debugPrint('Profiles received: ${profiles.length}');

      int maleCount = 0;
      int femaleCount = 0;
      int currentUserCount = 0;
      int totalProfiles = profiles.length;

      for (int i = 0; i < profiles.length && i < 10; i++) {
        // Check first 10 profiles
        String profileGender =
            profiles[i]['gender']?.toString().toLowerCase() ?? 'unknown';
        String profileName = profiles[i]['name'] ?? 'Unknown';
        String profileId = profiles[i]['id']?.toString() ?? '';

        // Check if this is current user (should not happen)
        if (profileId == currentUserId) {
          currentUserCount++;
          debugPrint(
              '🚨 $profileName: Current user found in results! (ID: $profileId)');
        } else if (profileGender == 'male') {
          maleCount++;
          debugPrint('✅ $profileName: $profileGender (Male)');
        } else if (profileGender == 'female') {
          femaleCount++;
          debugPrint('✅ $profileName: $profileGender (Female)');
        } else {
          debugPrint('❓ $profileName: $profileGender (Unknown gender)');
        }
      }

      debugPrint('Agent Profile Results:');
      debugPrint('  👨 Male: $maleCount');
      debugPrint('  👩 Female: $femaleCount');
      debugPrint('  🚨 Current User: $currentUserCount');
      debugPrint('  📊 Total: $totalProfiles');

      if (currentUserCount > 0) {
        debugPrint(
            '🔥 CRITICAL: Current user appears in results - Backend needs fixing!');
      }

      debugPrint('=====================================');
    } else {
      String expectedGender =
          userGender.toLowerCase() == 'male' ? 'female' : 'male';

      debugPrint('=== $sectionName NORMAL USER GENDER VERIFICATION ===');
      debugPrint('User Gender: $userGender');
      debugPrint('Expected Profile Gender: $expectedGender');
      debugPrint('Profiles received: ${profiles.length}');

      int correctGenderCount = 0;
      int wrongGenderCount = 0;
      int currentUserCount = 0;
      int totalProfiles = profiles.length;

      for (int i = 0; i < profiles.length && i < 10; i++) {
        // Check first 10 profiles
        String profileGender =
            profiles[i]['gender']?.toString().toLowerCase() ?? 'unknown';
        String profileName = profiles[i]['name'] ?? 'Unknown';
        String profileId = profiles[i]['id']?.toString() ?? '';

        // Check if this is current user (should not happen)
        if (profileId == currentUserId) {
          currentUserCount++;
          debugPrint(
              '🚨 $profileName: Current user found in results! (ID: $profileId)');
        } else if (profileGender == expectedGender) {
          correctGenderCount++;
          debugPrint('✅ $profileName: $profileGender (Correct)');
        } else {
          wrongGenderCount++;
          debugPrint(
              '❌ $profileName: $profileGender (Wrong! Expected: $expectedGender)');
        }
      }

      double accuracy = (correctGenderCount / totalProfiles) * 100;
      debugPrint('Gender Filtering Results:');
      debugPrint('  ✅ Correct: $correctGenderCount');
      debugPrint('  ❌ Wrong Gender: $wrongGenderCount');
      debugPrint('  🚨 Current User: $currentUserCount');
      debugPrint('  📊 Accuracy: ${accuracy.toStringAsFixed(1)}%');

      if (currentUserCount > 0) {
        debugPrint(
            '🔥 CRITICAL: Current user appears in results - Backend needs fixing!');
      }

      debugPrint('=====================================');
    }
  }

  // Load profile data from backend
  Future<void> _loadProfileData() async {
    // Load trending profiles
    _loadTrendingProfiles();

    // Load recommended profiles - Agent ke liye skip karo
    if (!isAgent) {
      _loadRecommendedProfiles();
    } else {
      setState(() {
        isLoadingRecommended = false;
      });
    }

    // Load latest profiles
    _loadLatestProfiles();

    // After loading profiles, also refresh shortlist data to ensure UI shows correct status
    if (isAgent) {
      await _loadShortlistedUsers();
    } else {
      await _loadNormalUserShortlistedUsers();
    }
  }

  // Load trending profiles from backend
  Future<void> _loadTrendingProfiles() async {
    try {
      List<Map<String, dynamic>> profiles;

      if (isAgent) {
        // Agent ke liye agent API use karo
        profiles = await ProfileService.fetchAgentTrendingProfiles(
          agentId: currentUserId,
        );
      } else {
        // Normal user ke liye normal API use karo
        profiles = await ProfileService.fetchTrendingProfiles(
          userId: currentUserId,
        );
      }

      if (mounted) {
        setState(() {
          trendingProfiles = profiles
              .map((profile) => ProfileService.formatProfileForUI(profile))
              .toList();
          isLoadingTrending = false;
        });

        // Verify gender filtering is working
        _verifyGenderFiltering('Trending', profiles);
      }
    } catch (e) {
      debugPrint('Error loading trending profiles: $e');
      if (mounted) {
        setState(() {
          isLoadingTrending = false;
        });
      }
    }
  }

  // Load recommended profiles from backend
  Future<void> _loadRecommendedProfiles() async {
    try {
      List<Map<String, dynamic>> profiles;

      if (isAgent) {
        // Agent ke liye agent API use karo
        profiles = await ProfileService.fetchAgentRecommendedProfiles(
          agentId: currentUserId,
        );
      } else {
        // Normal user ke liye normal API use karo
        profiles = await ProfileService.fetchRecommendedProfiles(
          userId: currentUserId,
        );
      }

      if (mounted) {
        setState(() {
          recommendations = profiles
              .map((profile) => ProfileService.formatProfileForUI(profile))
              .toList();
          isLoadingRecommended = false;
        });

        // Verify gender filtering is working
        _verifyGenderFiltering('Recommendations', profiles);
      }
    } catch (e) {
      debugPrint('Error loading recommended profiles: $e');
      if (mounted) {
        setState(() {
          isLoadingRecommended = false;
        });
      }
    }
  }

  // Load latest profiles from backend
  Future<void> _loadLatestProfiles() async {
    try {
      List<Map<String, dynamic>> profiles;

      if (isAgent) {
        // Agent ke liye agent API use karo
        debugPrint(
            '🔍 Calling fetchAgentLatestProfiles for agent ID: $currentUserId');
        profiles = await ProfileService.fetchAgentLatestProfiles(
          agentId: currentUserId,
        );
        debugPrint(
            '📊 Agent latest profiles received: ${profiles.length} profiles');
      } else {
        // Normal user ke liye normal API use karo
        debugPrint(
            '🔍 Calling fetchLatestProfiles for user ID: $currentUserId');
        profiles = await ProfileService.fetchLatestProfiles(
          userId: currentUserId,
        );
        debugPrint(
            '📊 Normal latest profiles received: ${profiles.length} profiles');
      }

      if (mounted) {
        setState(() {
          latestProfiles = profiles
              .map((profile) => ProfileService.formatProfileForUI(profile))
              .toList();
          isLoadingLatest = false;
        });

        // Verify gender filtering is working
        _verifyGenderFiltering('Latest', profiles);
      }
    } catch (e) {
      debugPrint('Error loading latest profiles: $e');
      if (mounted) {
        setState(() {
          isLoadingLatest = false;
        });
      }
    }
  }

  // Switch user method - Removed for production

  // Show logout confirmation dialog
  void _showLogoutConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: [
              Icon(
                Icons.logout,
                color: Colors.red.shade600,
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                'Logout',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
            ],
          ),
          content: Text(
            isAgent
                ? 'Are you sure you want to logout? You will need to login again to access your agent account.'
                : 'Are you sure you want to logout? You will need to login again to access your account.',
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 16,
              color: Colors.grey.shade600,
              height: 1.4,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _handleLogout();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade600,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Logout',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  // User logout - Clear all stored data and navigate to welcome screen
  Future<void> _handleLogout() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Clear all user-related data
      await prefs.remove('user_id');
      await prefs.remove('user_name');
      await prefs.remove('gender');
      await prefs.remove('current_step');
      await prefs.remove('homepage_visited');
      await prefs.remove('profile_completed');

      // Clear agent-related data
      await prefs.remove('agent_id');
      await prefs.remove('agent_token');
      await prefs.remove('temp_agent_email');
      await prefs.remove('temp_agent_contact');
      await prefs.remove('temp_agent_first_name');
      await prefs.remove('temp_agent_last_name');
      await prefs.remove('temp_agent_gender');
      await prefs.remove('temp_agent_password');
      await prefs.remove('agent_last_screen');

      // Clear step-specific data
      await prefs.remove('step1_selectedProfileFor');
      await prefs.remove('step1_fullName');
      await prefs.remove('step1_selectedGender');
      await prefs.remove('martial_status');
      await prefs.remove('step1_selectedDay');
      await prefs.remove('step1_selectedMonth');
      await prefs.remove('step1_selectedYear');
      await prefs.remove('step1_selectedFeet');
      await prefs.remove('step1_selectedInches');
      await prefs.remove('step1_country');
      await prefs.remove('step1_state');
      await prefs.remove('step1_city');

      debugPrint('✅ User/Agent data cleared successfully');

      if (mounted) {
        // Show logout success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isAgent
                  ? 'Agent logged out successfully'
                  : 'Logged out successfully',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            duration: const Duration(seconds: 2),
          ),
        );

        // Navigate directly to welcome screen
        Navigator.of(context).pushNamedAndRemoveUntil(
          '/welcome_screen', // Welcome screen route
          (route) => false,
        );
      }
    } catch (e) {
      debugPrint('Error during logout: $e');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Logout failed. Please try again.',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  // Update current user ID method removed - Not needed currently

  // Refresh all user data and profiles
  Future<void> _refreshUserData() async {
    try {
      debugPrint('🔄 Refreshing user data...');

      setState(() {
        isLoadingTrending = true;
        isLoadingRecommended = true;
        isLoadingLatest = true;
      });

      // Reload user data and profiles
      await _loadUserData();
      await _loadProfileData();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Data refreshed successfully',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      debugPrint('Error refreshing user data: $e');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to refresh data',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  // Navigate to next incomplete step in profile completion
  void _navigateToNextIncompleteStep() {
    debugPrint(
        '🎯 Analyzing profile completion and navigating to next step...');

    // Determine next incomplete step based on backend data
    _determineAndNavigateToIncompleteStep();
  }

  // Determine which step is incomplete and navigate there
  Future<void> _determineAndNavigateToIncompleteStep() async {
    try {
      // Get fresh user data from backend to check completion status
      final userProfile =
          await ProfileService.fetchUserProfile(userId: currentUserId);

      if (userProfile == null) {
        debugPrint('❌ Could not fetch user profile for step navigation');
        _showNavigationError('Unable to load profile data');
        return;
      }

      debugPrint('=== PROFILE COMPLETION ANALYSIS ===');
      debugPrint('User ID: $currentUserId');
      debugPrint(
          'Current Profile Percentage: ${userProfile['profile_percentage']}%');

      // Simple step determination based on profile percentage
      String nextStep =
          _getNextIncompleteStep(userProfile['profile_percentage']);

      debugPrint('🔄 Next incomplete step: $nextStep');
      await _navigateToStep(nextStep);
    } catch (e) {
      debugPrint('Error determining incomplete step: $e');
      _showNavigationError('Could not determine next step');
    }
  }

  // Simple method to determine next step based on profile percentage
  String _getNextIncompleteStep(double percentage) {
    if (percentage < 20) {
      return 'step1'; // Basic Information incomplete
    } else if (percentage < 40) {
      return 'step2'; // Religious Details incomplete
    } else if (percentage < 60) {
      return 'step3'; // Family Information incomplete
    } else if (percentage < 80) {
      return 'step3_1'; // Social Details incomplete
    } else if (percentage < 90) {
      return 'step4'; // Step 4 incomplete
    } else if (percentage < 100) {
      return 'step5'; // Step 5 incomplete
    } else {
      return 'step1'; // Fallback to step1 if 100% complete
    }
  }

  // Removed complex field analysis - using simple percentage-based logic instead

  // Navigate to specific step
  Future<void> _navigateToStep(String step) async {
    try {
      switch (step) {
        case 'step1':
          try {
            Navigator.of(context).pushNamed('/step1');
          } catch (e) {
            // Handle navigation error silently
            _showNavigationError('Step 1 route not found');
          }
          break;
        case 'step2':
          try {
            Navigator.of(context).pushNamed('/step2');
          } catch (e) {
            // Handle navigation error silently
            _showNavigationError('Step 2 route not found');
          }
          break;
        case 'step3':
          try {
            Navigator.of(context).pushNamed('/step3');
          } catch (e) {
            // Handle navigation error silently
            _showNavigationError('Step 3 navigation failed');
          }
          break;
        case 'step3_1':
          try {
            Navigator.of(context).pushNamed('/step3_1');
          } catch (e) {
            // Handle navigation error silently
            _showNavigationError('Step 3_1 route not found');
          }
          break;
        case 'step4':
          try {
            Navigator.of(context).pushNamed('/step4');
          } catch (e) {
            // Handle navigation error silently
            _showNavigationError('Step 4 route not found');
          }
          break;
        case 'step5':
          try {
            Navigator.of(context).pushNamed('/step5');
          } catch (e) {
            // Handle navigation error silently
            _showNavigationError('Step 5 route not found');
          }
          break;
        default:
          // Handle unknown step silently
          _showNavigationError('Unknown step to navigate to');
      }
    } catch (e) {
      // debugPrint('❌ Error in _navigateToStep: $e');
      _showNavigationError('Navigation failed');
    }
  }

  // Show navigation error message
  void _showNavigationError(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            message,
            style: GoogleFonts.ibmPlexSansArabic(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  // Show profile complete message
  void _showProfileCompleteMessage() {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Congratulations! Your profile is 100% complete! 🎉',
            style: GoogleFonts.ibmPlexSansArabic(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  // Show photo upload message
  void _showPhotoUploadMessage() {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Please upload your profile photo to complete registration',
            style: GoogleFonts.ibmPlexSansArabic(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          backgroundColor: Colors.blue,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  // Show profile completion steps as modern bottom sheet
  void _showProfileStepsDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isDismissible: true,
      enableDrag: true,
      isScrollControlled: true,
      builder: (BuildContext context) {
        return Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            minHeight: MediaQuery.of(context).size.height * 0.7,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(25),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, -5),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Modern drag handle
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // Header with gradient
              Container(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.red.shade600, Colors.orange.shade600],
                  ),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child:
                          Icon(Icons.checklist, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Profile Completion Steps',
                            style: GoogleFonts.ibmPlexSansArabic(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Complete your profile to find better matches',
                            style: GoogleFonts.ibmPlexSansArabic(
                              fontSize: 12,
                              color: Colors.white.withOpacity(0.8),
                            ),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.of(context).pop(),
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(Icons.close, color: Colors.white, size: 20),
                      ),
                    ),
                  ],
                ),
              ),

              // Scrollable content
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Profile completion progress bar
                      Container(
                        margin: const EdgeInsets.only(bottom: 20),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Overall Progress',
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                                Text(
                                  '${profilePercentage.toStringAsFixed(0)}%',
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: profilePercentage >= 75
                                        ? Colors.green
                                        : Colors.orange,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            LinearProgressIndicator(
                              value: profilePercentage / 100,
                              backgroundColor: Colors.grey.shade200,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                profilePercentage >= 75
                                    ? Colors.green
                                    : Colors.orange,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Dynamic step items based on actual completion
                      FutureBuilder<List<Map<String, dynamic>>>(
                        future: _getStepCompletionStatus(),
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return Center(
                              child: CircularProgressIndicator(
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.red.shade600),
                              ),
                            );
                          }

                          if (snapshot.hasError) {
                            return _buildDefaultStepItems();
                          }

                          final steps = snapshot.data ?? [];
                          if (steps.isEmpty) {
                            return _buildDefaultStepItems();
                          }

                          return Column(
                            children: steps.map((step) {
                              return _buildStepItem(
                                step['number'],
                                step['title'],
                                step['isCompleted'],
                                step['color'],
                              );
                            }).toList(),
                          );
                        },
                      ),

                      const SizedBox(height: 20),

                      // Action button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                            _navigateToNextIncompleteStep();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red.shade600,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 0,
                          ),
                          child: Text(
                            profilePercentage >= 90
                                ? 'VIEW PROFILE'
                                : 'CONTINUE SETUP',
                            style: GoogleFonts.ibmPlexSansArabic(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),

                      // Safe area padding for bottom
                      SizedBox(
                          height: MediaQuery.of(context).padding.bottom + 20),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // Get actual step completion status from backend (simplified)
  Future<List<Map<String, dynamic>>> _getStepCompletionStatus() async {
    try {
      // Fetch fresh user data from backend
      final userProfile =
          await ProfileService.fetchUserProfile(userId: currentUserId);

      if (userProfile == null) {
        return [];
      }

      double percentage = userProfile['profile_percentage'] ?? 0.0;

      // Simple step completion based on percentage
      List<Map<String, dynamic>> steps = [];

      // Step 1: Basic Information
      bool step1Complete = percentage >= 20;
      steps.add({
        'number': 1,
        'title': 'Basic Information',
        'isCompleted': step1Complete,
        'color': step1Complete ? Colors.green : Colors.red,
      });

      // Step 2: Religious Details
      bool step2Complete = percentage >= 40;
      steps.add({
        'number': 2,
        'title': 'Religious Details',
        'isCompleted': step2Complete,
        'color': step2Complete ? Colors.green : Colors.orange,
      });

      // Step 3: Family Information
      bool step3Complete = percentage >= 60;
      steps.add({
        'number': 3,
        'title': 'Family Information',
        'isCompleted': step3Complete,
        'color': step3Complete ? Colors.green : Colors.orange,
      });

      // Step 3_1: Social Details (Education, Profession, etc.)
      bool step3_1Complete = percentage >= 80;
      steps.add({
        'number': '3.1',
        'title': 'Social Details',
        'isCompleted': step3_1Complete,
        'color': step3_1Complete ? Colors.green : Colors.orange,
      });

      // Step 4: Partner Preferences
      bool step4Complete = percentage >= 90;
      steps.add({
        'number': 4,
        'title': 'Partner Preferences',
        'isCompleted': step4Complete,
        'color': step4Complete ? Colors.green : Colors.orange,
      });

      // Step 5: Final Details & Profile Setup
      bool step5Complete = percentage >= 100;
      steps.add({
        'number': 5,
        'title': 'Final Details & Profile Setup',
        'isCompleted': step5Complete,
        'color': step5Complete ? Colors.green : Colors.red,
      });

      return steps;
    } catch (e) {
      debugPrint('Error getting step completion status: $e');
      return [];
    }
  }

  // Removed complex step completion check methods - using simple percentage-based logic instead

  // Build default step items if API fails
  Widget _buildDefaultStepItems() {
    return Column(
      children: [
        _buildStepItem(1, "Basic Information", true, Colors.green),
        _buildStepItem(2, "Religious Details", true, Colors.green),
        _buildStepItem(3, "Family Information", false, Colors.orange),
        _buildStepItem("3.1", "Social Details", false, Colors.orange),
        _buildStepItem(4, "Partner Preferences", false, Colors.orange),
        _buildStepItem(5, "Final Details & Profile Setup", false, Colors.red),
      ],
    );
  }
.
  // Build individual step item for dialog - Enhanced with better layout and tap functionality
  Widget _buildStepItem(
      dynamic stepNumber, String title, bool isCompleted, Color statusColor) {
    // Determine if step should be tappable (only pending steps)
    bool isTappable = !isCompleted;

    // Get step route for navigation
    String? stepRoute = _getStepRoute(stepNumber);

    Widget stepContent = Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isCompleted ? Colors.green.shade50 : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isCompleted ? Colors.green.shade200 : Colors.grey.shade300,
          width: 1.5,
        ),
        // Add subtle shadow for depth
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? Colors.green : statusColor).withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Step number/check icon
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: isCompleted ? Colors.green : statusColor,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: (isCompleted ? Colors.green : statusColor)
                        .withOpacity(0.3),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: isCompleted
                    ? Icon(Icons.check, color: Colors.white, size: 18)
                    : Text(
                        stepNumber.toString(),
                        style: GoogleFonts.ibmPlexSansArabic(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: stepNumber.toString().length > 1 ? 12 : 14,
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 16),

            // Step details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                            height: 1.2,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      // Show tap hint for pending steps only
                      if (isTappable)
                        Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'TAP',
                            style: GoogleFonts.ibmPlexSansArabic(
                              fontSize: 9,
                              color: statusColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),

                  // Status with icon
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: isCompleted
                              ? Colors.green.withOpacity(0.1)
                              : statusColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          isCompleted ? 'Completed' : 'Tap to continue',
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontSize: 11,
                            color: isCompleted
                                ? Colors.green.shade700
                                : statusColor,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Status indicator with arrow for tappable items
            Container(
              padding: const EdgeInsets.all(2),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    isCompleted
                        ? Icons.check_circle
                        : Icons.radio_button_unchecked,
                    color: isCompleted ? Colors.green : statusColor,
                    size: 22,
                  ),
                  if (isTappable) ...[
                    const SizedBox(width: 4),
                    Icon(
                      Icons.arrow_forward_ios,
                      color: statusColor,
                      size: 14,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );

    // Make step tappable only if it's pending
    if (isTappable && stepRoute != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            // Debug logging for step navigation
            debugPrint('🎯 User tapped on Step $stepNumber: $title');
            debugPrint('🔄 Navigating to route: $stepRoute');

            // Close bottom sheet first
            Navigator.of(context).pop();

            // Add small delay for smooth transition
            await Future.delayed(const Duration(milliseconds: 200));

            // Navigate to the specific step
            await _navigateToStep(stepRoute);
          },
          borderRadius: BorderRadius.circular(12),
          splashColor: statusColor.withOpacity(0.1),
          highlightColor: statusColor.withOpacity(0.05),
          child: stepContent,
        ),
      );
    }

    // Return non-tappable content for completed steps
    return stepContent;
  }

  // Helper method to get step route based on step number
  String? _getStepRoute(dynamic stepNumber) {
    switch (stepNumber.toString()) {
      case '1':
        return 'step1';
      case '2':
        return 'step2';
      case '3':
        return 'step3';
      case '3.1':
        return 'step3_1';
      case '4':
        return 'step4';
      case '5':
        return 'step5';
      default:
        return null;
    }
  }

  // allMembers ko ab getter bana rahe hain
  List<Map<String, String?>> get allMembers => [
        ...trendingProfiles,
        ...recommendations,
        ...latestProfiles,
      ];

  // Send interest to a user - Real backend API call (ab Map response handle karega)
  Future<void> _sendInterest(String toUserName, String toUserId) async {
    try {
      debugPrint('=== SENDING INTEREST FROM HOMEPAGE ===');
      debugPrint('Current User ID: $currentUserId');
      debugPrint('Target User ID: $toUserId');
      debugPrint('Target User Name: $toUserName');

      // Ab backend ka pura response lo
      final response = await ProfileService.sendInterest(
        fromUserId: currentUserId,
        toUserId: toUserId,
        toUserName: toUserName,
      );

      // Response ke hisaab se snackbar dikhayein
      if (response['already_sent'] == true) {
        // Already sent
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response['message'] ?? 'Interest already sent!',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: Colors.orange,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        }
      } else if (response['error'] != null) {
        // Error case
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response['message'] ?? 'Kuch galat ho gaya. Please try again.',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        }
      } else {
        // Success case
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response['message'] ?? 'Interest sent successfully!',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error sending interest from homepage: $e');
      // Show error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Something went wrong. Please try again.',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  // Load shortlisted users for agent
  Future<void> _loadShortlistedUsers() async {
    try {
      if (agentId == null) return;

      final response = await http.get(
        Uri.parse(
            '${ProfileService.baseUrl}/agent/shortlist/?agent_id=$agentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${await _getAgentToken()}',
        },
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);

        setState(() {
          shortlistedUserIds.clear();
          for (var item in data) {
            if (item['shortlisted'] == true) {
              shortlistedUserIds.add(item['action_on_id'].toString());
            }
          }
        });
      }
    } catch (e) {
      // Handle error silently in production
    }
  }

  // Load shortlisted users for normal users
  Future<void> _loadNormalUserShortlistedUsers() async {
    try {
      final shortlistedUsers = await ProfileService.fetchShortlistedUsers(
        userId: currentUserId,
      );

      setState(() {
        shortlistedUserIds.clear();
        for (var user in shortlistedUsers) {
          // Backend se data aa raha hai: {"user": {"id": 3, ...}}
          if (user.containsKey('user') && user['user'] is Map) {
            final userData = user['user'] as Map<String, dynamic>;
            if (userData.containsKey('id')) {
              shortlistedUserIds.add(userData['id'].toString());
            }
          }
          // Fallback for different data structure
          else if (user.containsKey('id')) {
            shortlistedUserIds.add(user['id'].toString());
          } else if (user.containsKey('user_id')) {
            shortlistedUserIds.add(user['user_id'].toString());
          }
        }
      });
    } catch (e) {
      // Handle error silently in production
    }
  }

  // Get agent token helper method
  Future<String?> _getAgentToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('agent_token');
  }

  // Refresh shortlist status for a specific user (for realtime updates)
  Future<void> _refreshShortlistStatus(String userId) async {
    try {
      if (isAgent) {
        // For agents, check if user is shortlisted
        final isShortlisted =
            await ProfileService.checkIfUserShortlistedByAgent(
          agentId: agentId.toString(),
          userId: userId,
        );

        setState(() {
          if (isShortlisted) {
            shortlistedUserIds.add(userId);
          } else {
            shortlistedUserIds.remove(userId);
          }
        });
      } else {
        // For normal users, check if user is in their shortlist
        final shortlistedUsers = await ProfileService.fetchShortlistedUsers(
          userId: currentUserId,
        );

        setState(() {
          shortlistedUserIds.clear();
          for (var user in shortlistedUsers) {
            if (user['id'] != null) {
              shortlistedUserIds.add(user['id'].toString());
            } else if (user['user_id'] != null) {
              shortlistedUserIds.add(user['user_id'].toString());
            }
          }
        });
      }
    } catch (e) {
      // Handle error silently in production
    }
  }

  // Agent shortlist toggle functionality - Add ya Remove
  Future<void> _agentShortlist(String toUserName, String toUserId) async {
    try {
      if (agentId == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Agent ID not found. Please login again.',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        }
        return;
      }

      // Pehle check karo ki user already shortlisted hai ya nahi
      final isCurrentlyShortlisted =
          await ProfileService.checkIfUserShortlistedByAgent(
        agentId: agentId.toString(),
        userId: toUserId,
      );

      // Ab toggle functionality use karo
      final response = await ProfileService.agentToggleShortlist(
        agentId: agentId.toString(),
        toUserId: toUserId,
        toUserName: toUserName,
        isCurrentlyShortlisted: isCurrentlyShortlisted,
      );

      // Response ke hisaab se UI update karo
      if (response['success'] == true) {
        // Success case - show appropriate message based on action
        final newStatus = response['isShortlisted'] ?? false;
        final actionText = newStatus ? 'shortlisted' : 'removed from shortlist';

        // Update UI state immediately for better UX
        if (mounted) {
          setState(() {
            if (newStatus) {
              shortlistedUserIds.add(toUserId);
            } else {
              shortlistedUserIds.remove(toUserId);
            }
          });
        }

        // Trigger animation for better visual feedback
        _shortlistAnimationController.forward().then((_) {
          _shortlistAnimationController.reverse();
        });

        // Show success feedback
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                '$toUserName $actionText successfully!',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      } else {
        // Error case
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response['message'] ?? 'Kuch galat ho gaya. Please try again.',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error agent toggling shortlist from homepage: $e');
      // Show error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Something went wrong. Please try again.',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Agar Activity tab select hai toh conditional navigation
    if (_selectedIndex == 1) {
      if (isAgent) {
        return AgentActivityScreen();
      } else {
        return ActivityScreen();
      }
    }
    return Scaffold(
      key: _scaffoldKey,
      // Modern drawer add karte hain
      drawer: _buildModernDrawer(),
      // Modern gradient background banate hain
      body: SlideTransition(
        position: _slideAnimation,
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.pink.shade50.withOpacity(0.3),
                  Colors.purple.shade50.withOpacity(0.2),
                  Colors.white,
                  Colors.blue.shade50.withOpacity(0.1),
                ],
                stops: const [0.0, 0.3, 0.7, 1.0],
              ),
            ),
            child: SafeArea(
              child: RefreshIndicator(
                onRefresh: _refreshUserData,
                color: Colors.pink,
                backgroundColor: Colors.white,
                strokeWidth: 2.5,
                child: ListView(
                  padding: EdgeInsets.zero,
                  physics:
                      const AlwaysScrollableScrollPhysics(), // Enables pull to refresh even when content is small
                  children: [
                    _buildModernAppBar(),
                    if (!isProfileComplete) _buildModernProfileBanner(),
                    if (userGender != 'unknown') _buildGenderFilterBanner(),
                    const SizedBox(height: 8),
                    _buildModernSection(
                      'Trending Profiles',
                      _getGenderFilteredSubtitle('Most active and popular'),
                      trendingProfiles,
                      Colors.pink,
                      isLoading: isLoadingTrending,
                    ),
                    const SizedBox(height: 16),
                    // Agent ke liye recommendations section hide karo
                    if (!isAgent)
                      _buildModernSection(
                        'Recommendations',
                        _getGenderFilteredSubtitle(
                            'Best matches based on your preferences'),
                        recommendations,
                        Colors.purple,
                        isLoading: isLoadingRecommended,
                      ),
                    if (!isAgent) const SizedBox(height: 16),
                    _buildModernSection(
                      'Latest Profiles',
                      _getGenderFilteredSubtitle(
                          'Newest members who just joined'),
                      latestProfiles,
                      Colors.blue,
                      isLoading: isLoadingLatest,
                    ),
                    const SizedBox(height: 100), // Bottom nav ke liye space
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: _buildModernBottomNavBar(),
    );
  }

  // Ultra modern AppBar with glassmorphism effect
  Widget _buildModernAppBar() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 10, 16, 5),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.white.withOpacity(0.9),
              Colors.white.withOpacity(0.8),
            ],
          ),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(color: Colors.white.withOpacity(0.3)),
          boxShadow: [
            BoxShadow(
              color: Colors.pink.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            GestureDetector(
              onTap: () {
                _scaffoldKey.currentState?.openDrawer();
              },
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.pink.shade400, Colors.pink.shade600],
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: const Icon(Icons.menu, color: Colors.white, size: 24),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Assalam-o-Alaikum',
                    style: GoogleFonts.ibmPlexSansArabic(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '$userName!',
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                            fontSize: 20,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Row(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    GestureDetector(
                      onTap: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                NotificationScreen(userId: currentUserId),
                          ),
                        );
                        _fetchNotifications(); // Refresh after returning
                      },
                      child: Icon(Icons.notifications_none,
                          color: Colors.grey.shade700, size: 26),
                    ),
                    if (_notificationCount > 0)
                      Positioned(
                        right: -10,
                        top: -10,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.pink,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 1.5),
                          ),
                          constraints: BoxConstraints(
                            minWidth: 18,
                            minHeight: 18,
                          ),
                          child: Center(
                            child: Text(
                              '$_notificationCount',
                              style: GoogleFonts.ibmPlexSansArabic(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 8),
                _buildIconButton(Icons.tune, () {}),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Modern icon button with animation effect
  Widget _buildIconButton(IconData icon, VoidCallback onTap) {
    // Agar filter icon hai toh uske liye custom onTap lagayenge
    if (icon == Icons.tune) {
      return GestureDetector(
        onTap: () {
          _showFilterBottomSheet();
        },
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Icon(icon, color: Colors.grey.shade700, size: 20),
        ),
      );
    }
    // Baaki icons ke liye default
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(icon, color: Colors.grey.shade700, size: 20),
      ),
    );
  }

  // Gender filter information banner
  Widget _buildGenderFilterBanner() {
    if (isAgentImpersonating) {
      // Agent impersonating user ke liye special banner
      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.blue.shade100.withOpacity(0.4),
              Colors.green.shade100.withOpacity(0.3),
            ],
          ),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.blue.withOpacity(0.4)),
          boxShadow: [
            BoxShadow(
              color: Colors.blue.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.blue.shade400,
                      Colors.green.shade400,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  Icons.swap_horiz_rounded,
                  color: Colors.white,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Agent Mode - Viewing as User',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Colors.blue.shade800,
                      ),
                    ),
                    Text(
                      'You are currently viewing as $userName',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.blue.shade700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => _returnToAgentMode(),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.blue.shade500,
                        Colors.green.shade500,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.withOpacity(0.3),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    'Return to Agent',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    } else if (isAgent) {
      // Agent ke liye special banner
      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.purple.shade100.withOpacity(0.3),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.purple.withOpacity(0.3)),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  Icons.people,
                  color: Colors.purple.shade700,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Showing ALL profiles (Male & Female) as Agent',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Agent ID: $agentId • All genders visible',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 11,
                        color: Colors.grey.shade500,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    } else {
      // Normal user ke liye existing banner
      String oppositeGender =
          userGender.toLowerCase() == 'male' ? 'Female' : 'Male';
      IconData genderIcon =
          userGender.toLowerCase() == 'male' ? Icons.female : Icons.male;
      Color bannerColor = userGender.toLowerCase() == 'male'
          ? Colors.pink.shade100
          : Colors.blue.shade100;

      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          color: bannerColor.withOpacity(0.3),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
              color: userGender.toLowerCase() == 'male'
                  ? Colors.pink.withOpacity(0.3)
                  : Colors.blue.withOpacity(0.3)),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: userGender.toLowerCase() == 'male'
                      ? Colors.pink.withOpacity(0.2)
                      : Colors.blue.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  genderIcon,
                  color: userGender.toLowerCase() == 'male'
                      ? Colors.pink.shade700
                      : Colors.blue.shade700,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Showing $oppositeGender profiles as per Islamic matrimonial traditions',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Your gender: ${userGender.toLowerCase()} • User ID: $currentUserId',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 11,
                        color: Colors.grey.shade500,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }
  }

  // Modern profile completion banner with professional progress bar - OVERFLOW FIXED
  Widget _buildModernProfileBanner() {
    // Use actual profile percentage from backend API

    // Professional color coding based on completion percentage
    Color getProgressColor(double percentage) {
      if (percentage >= 90) return Colors.green.shade600; // Excellent
      if (percentage >= 75) return Colors.amber.shade600; // Good Progress
      if (percentage >= 50) return Colors.orange.shade600; // Needs Attention
      return Colors.red.shade600; // Critical
    }

    String getStatusText(double percentage) {
      if (percentage >= 90) return "Excellent!";
      if (percentage >= 75) return "Almost Complete";
      if (percentage >= 50) return "Good Progress";
      return "Needs Attention";
    }

    String getMotivationText(double percentage) {
      if (percentage >= 90) return "Ready to find perfect match!";
      if (percentage >= 75) return "Few more details to complete.";
      if (percentage >= 50) return "Continue for better matches.";
      return "Complete for better matches.";
    }

    Color progressColor = getProgressColor(profilePercentage);
    String statusText = getStatusText(profilePercentage);
    String motivationText = getMotivationText(profilePercentage);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.95),
            Colors.grey.shade50.withOpacity(0.9),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: progressColor.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: progressColor.withOpacity(0.1),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background pattern
          Positioned(
            right: -20,
            top: -20,
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: progressColor.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header with percentage and status - OVERFLOW FIXED
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: progressColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        profilePercentage >= 90
                            ? Icons.verified
                            : Icons.account_circle,
                        color: progressColor,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Flexible row to prevent overflow
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  '${profilePercentage.toStringAsFixed(0)}% Complete',
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                    fontSize: 16,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: progressColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  statusText,
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    fontSize: 9,
                                    color: progressColor,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          // Constrained text to prevent overflow
                          Text(
                            motivationText,
                            style: GoogleFonts.ibmPlexSansArabic(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                              height: 1.2,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Professional Progress Bar
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          child: Text(
                            'Profile Completion',
                            style: GoogleFonts.ibmPlexSansArabic(
                              fontSize: 11,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w500,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Text(
                          '${profilePercentage.toStringAsFixed(1)}%',
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontSize: 11,
                            color: progressColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Multi-segment progress bar
                    Container(
                      height: 6,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        borderRadius: BorderRadius.circular(3),
                      ),
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: profilePercentage / 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                progressColor,
                                progressColor.withOpacity(0.8),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Action buttons - OVERFLOW FIXED
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          _navigateToNextIncompleteStep();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                progressColor,
                                progressColor.withOpacity(0.8)
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: progressColor.withOpacity(0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.edit,
                                color: Colors.white,
                                size: 14,
                              ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  profilePercentage >= 90
                                      ? 'VIEW PROFILE'
                                      : 'CONTINUE SETUP',
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                  textAlign: TextAlign.center,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    GestureDetector(
                      onTap: () {
                        _showProfileStepsDialog();
                      },
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Icon(
                          Icons.list_alt,
                          color: Colors.grey.shade600,
                          size: 18,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Modern section with glassmorphism and color theming
  Widget _buildModernSection(
    String title,
    String subtitle,
    List<Map<String, String?>> profiles,
    Color themeColor, {
    bool isLoading = false,
  }) {
    // Agar filter applied hai toh filtered profiles dikhao
    if (_isFilterApplied) {
      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildModernSectionHeader(title, subtitle, themeColor),
            const SizedBox(height: 16),
            _isLoadingFilter
                ? _buildLoadingIndicator(themeColor)
                : _filteredProfiles.isEmpty
                    ? _buildEmptyState('Filtered Profiles', themeColor)
                    : _buildModernProfileList(_filteredProfiles, themeColor),
            const SizedBox(height: 16),
            if (!_isLoadingFilter && _filteredProfiles.isNotEmpty)
              _buildSeeAllButton(title, themeColor),
          ],
        ),
      );
    }
    // Default: original profiles dikhao
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildModernSectionHeader(title, subtitle, themeColor),
          const SizedBox(height: 16),
          isLoading
              ? _buildLoadingIndicator(themeColor)
              : profiles.isEmpty
                  ? _buildEmptyState(title, themeColor)
                  : _buildModernProfileList(profiles, themeColor),
          const SizedBox(height: 16),
          if (!isLoading && profiles.isNotEmpty)
            _buildSeeAllButton(title, themeColor),
        ],
      ),
    );
  }

  // Modern section header with animated underline
  Widget _buildModernSectionHeader(
    String title,
    String subtitle,
    Color themeColor,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 4,
                height: 24,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [themeColor, themeColor.withOpacity(0.5)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.ibmPlexSansArabic(
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                    color: Colors.black87,
                  ),
                ),
              ),
              Icon(
                Icons.trending_up,
                color: themeColor,
                size: 24,
              ),
            ],
          ),
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.only(left: 16),
            child: Text(
              subtitle,
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.grey.shade600,
                fontSize: 14,
                height: 1.3,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Instagram-style shimmer loading for profile sections
  Widget _buildLoadingIndicator(Color themeColor) {
    return SizedBox(
      height: 380,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 4),
        itemCount: 3, // Show 3 shimmer cards
        separatorBuilder: (context, index) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          return _buildShimmerProfileCard(themeColor);
        },
      ),
    );
  }

  // Beautiful shimmer profile card like Instagram
  Widget _buildShimmerProfileCard(Color themeColor) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        width: 200,
        height: 370,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
          border: Border.all(color: themeColor.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: themeColor.withOpacity(0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          children: [
            // Profile image shimmer
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(25),
                  topRight: Radius.circular(25),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Profile details shimmer
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name shimmer
                  Container(
                    height: 16,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Age & Height shimmer
                  Container(
                    height: 12,
                    width: 120,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Location shimmer
                  Container(
                    height: 12,
                    width: 160,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Education shimmer
                  Container(
                    height: 12,
                    width: 140,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Match percentage shimmer
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        height: 14,
                        width: 80,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(7),
                        ),
                      ),
                      Container(
                        height: 24,
                        width: 24,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Action buttons shimmer
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 36,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade300,
                            borderRadius: BorderRadius.circular(18),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        height: 36,
                        width: 36,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Empty state for profile sections
  Widget _buildEmptyState(String title, Color themeColor) {
    // Agar filter applied hai toh special message dikhayein
    if (_isFilterApplied) {
      return Container(
        height: 240,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 60,
              color: themeColor.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No profiles found for your filter',
              style: GoogleFonts.ibmPlexSansArabic(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try changing your filter or clear filter to see more profiles.',
              style: GoogleFonts.ibmPlexSansArabic(
                fontSize: 14,
                color: Colors.grey.shade500,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 18),
            OutlinedButton(
              onPressed: () {
                setState(() {
                  _filterAgeRange = const RangeValues(18, 40);
                  _filterCountry = null;
                  _filterState = null;
                  _filterCity = null;
                  _filterProfession = null;
                  _filterEducation = null;
                  _filterMaritalStatus = null;
                  _isFilterApplied = false;
                  _filteredProfiles = [];
                  _filterLocationController.clear();
                });
              },
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: themeColor),
                padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Clear Filter',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: themeColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
      );
    }
    // Default: original empty state
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline,
            size: 60,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'No ${title.toLowerCase()} found',
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Check back later for new profiles',
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 14,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  // Modern horizontal profile list with enhanced cards
  Widget _buildModernProfileList(
    List<Map<String, String?>> profiles,
    Color themeColor,
  ) {
    return SizedBox(
      height: 380,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 4),
        itemCount: profiles.length,
        separatorBuilder: (context, index) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final user = profiles[index];
          return _buildModernProfileCard(
            name: user['name'] ?? '',
            marital: user['marital'] ?? '',
            age: user['age'] ?? '',
            photo: user['photo'],
            match: user['match'],
            gender: user['gender'],
            location: user['location'] ?? '',
            profession: user['profession'] ?? '',
            userId: user['id'] ?? '',
            themeColor: themeColor,
            profileData: user, // Pass complete user data for agent verification
          );
        },
      ),
    );
  }

  // Ultra modern profile card with glassmorphism and hover effects
  Widget _buildModernProfileCard({
    required String name,
    required String marital,
    required String age,
    String? photo,
    String? match,
    String? gender,
    required String location,
    required String profession,
    required String userId,
    required Color themeColor,
    Map<String, dynamic>?
        profileData, // Agent verification ke liye profile data
  }) {
    final String maritalDisplay = (marital.isNotEmpty) ? marital : 'Status N/A';
    final String ageDisplay = (age.isNotEmpty) ? age : '--';
    final String? matchDisplay =
        (match != null && match.isNotEmpty) ? match : null;

    // Gender based placeholder logic
    bool showHijab = (gender != null &&
        gender.toLowerCase() == 'female' &&
        (photo == null || photo.isEmpty));
    bool showMuslimMan = (gender != null &&
        gender.toLowerCase() == 'male' &&
        (photo == null || photo.isEmpty));

    // Profile card ko tappable bana rahe hain
    return GestureDetector(
      onTap: () async {
        // Profile visit ko backend pe log karo (ab token khud fetch karega)
        await ProfileService.logProfileVisit(visitedUserId: userId);
        // Profile details fetch karo (agar zarurat ho toh backend se)
        Map<String, dynamic>? userData =
            await ProfileService.fetchUserProfile(userId: userId);
        if (userData != null && context.mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProfileDetailsScreen(
                userData: userData,
                currentUserGender: userGender,
                currentUserId: currentUserId, // Ab sahi ID pass ho rahi hai
              ),
            ),
          );
        }
      },
      child: Container(
        width: 200,
        height: 370,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.white.withOpacity(0.9),
              Colors.white.withOpacity(0.8),
            ],
          ),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(color: themeColor.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: themeColor.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
            BoxShadow(
              color: Colors.white.withOpacity(0.5),
              blurRadius: 20,
              offset: const Offset(-5, -5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Enhanced Photo Section
            Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 200,
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(25),
                    ),
                    gradient: LinearGradient(
                      colors: [
                        Colors.grey.shade100,
                        Colors.grey.shade50,
                      ],
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(25),
                    ),
                    child: showHijab
                        ? Stack(
                            children: [
                              Image.asset(
                                'assets/images/hijab-woman.png',
                                fit: BoxFit.cover,
                                width: double.infinity,
                                height: double.infinity,
                              ),
                              // Subtle overlay for better text visibility
                              Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withOpacity(0.1),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          )
                        : showMuslimMan
                            ? Stack(
                                children: [
                                  Image.asset(
                                    'assets/images/muslim-man.png',
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                    height: double.infinity,
                                  ),
                                  Container(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                        colors: [
                                          Colors.transparent,
                                          Colors.black.withOpacity(0.1),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              )
                            : (photo != null && photo.isNotEmpty
                                ? Stack(
                                    children: [
                                      Image.network(
                                        photo,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        height: double.infinity,
                                        loadingBuilder:
                                            (context, child, loadingProgress) {
                                          if (loadingProgress == null)
                                            return child;
                                          return Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors.grey.shade200,
                                                  Colors.grey.shade100,
                                                ],
                                              ),
                                            ),
                                            child: Center(
                                              child: CircularProgressIndicator(
                                                value: loadingProgress
                                                            .expectedTotalBytes !=
                                                        null
                                                    ? loadingProgress
                                                            .cumulativeBytesLoaded /
                                                        loadingProgress
                                                            .expectedTotalBytes!
                                                    : null,
                                                valueColor:
                                                    AlwaysStoppedAnimation<
                                                        Color>(themeColor),
                                              ),
                                            ),
                                          );
                                        },
                                        errorBuilder:
                                            (context, error, stackTrace) {
                                          debugPrint(
                                              '❌ Image loading error for $photo: $error');
                                          return Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors.grey.shade200,
                                                  Colors.grey.shade100,
                                                ],
                                              ),
                                            ),
                                            child: Icon(
                                              Icons.person,
                                              size: 60,
                                              color: Colors.grey.shade400,
                                            ),
                                          );
                                        },
                                      ),
                                      Container(
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            begin: Alignment.topCenter,
                                            end: Alignment.bottomCenter,
                                            colors: [
                                              Colors.transparent,
                                              Colors.black.withOpacity(0.1),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  )
                                : Container(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          Colors.grey.shade200,
                                          Colors.grey.shade100,
                                        ],
                                      ),
                                    ),
                                    child: Icon(
                                      Icons.person,
                                      size: 60,
                                      color: Colors.grey.shade400,
                                    ),
                                  )),
                  ),
                ),
                // Enhanced Match Badge - Agent ke liye hide karo
                if (matchDisplay != null && !isAgent)
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.green.shade400,
                            Colors.green.shade600,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.green.withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.favorite,
                            color: Colors.white,
                            size: 12,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            matchDisplay,
                            style: GoogleFonts.ibmPlexSansArabic(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                // Menu button - top right corner mein
                Positioned(
                  top: 12,
                  right: matchDisplay != null && !isAgent
                      ? 80
                      : 12, // Match badge ke saath adjust
                  child: _buildProfileCardMenu(
                    userId: userId,
                    userName: name,
                    themeColor: themeColor,
                    profileData: profileData ?? {},
                  ),
                ),
                // Status indicator
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: themeColor.withOpacity(0.3)),
                    ),
                    child: Text(
                      maritalDisplay,
                      style: GoogleFonts.ibmPlexSansArabic(
                        color: themeColor,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                // Shortlisted indicator with animation
                if (shortlistedUserIds.contains(userId))
                  Positioned(
                    bottom: 12,
                    right: 12, // Position it at the bottom right of the photo
                    child: AnimatedBuilder(
                      animation: _shortlistAnimationController,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: 1.0 + (_shortlistScaleAnimation.value * 0.1),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.amber.shade400,
                                  Colors.amber.shade600,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.amber.withOpacity(0.3),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.star,
                                  color: Colors.white,
                                  size: 10,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Shortlisted',
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
              ],
            ),
            // Enhanced Profile Information Section
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Name and age with agent verification badge
                    Row(
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  name,
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              // Agent verification badge - sirf agent verified users ke liye
                              if (profileData != null &&
                                  profileData['agent_verified'] == true) ...[
                                SizedBox(width: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.green.shade400,
                                        Colors.green.shade600,
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Icon(
                                    Icons.verified_user,
                                    color: Colors.white,
                                    size: 12,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 7,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: themeColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '$ageDisplay yrs',
                            style: GoogleFonts.ibmPlexSansArabic(
                              fontSize: 11,
                              color: themeColor,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    // Profession
                    if (profession.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          profession,
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontSize: 11,
                            color: Colors.grey.shade700,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    const SizedBox(height: 6),
                    // Location
                    if (location.isNotEmpty)
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_outlined,
                            size: 13,
                            color: Colors.grey.shade600,
                          ),
                          const SizedBox(width: 3),
                          Expanded(
                            child: Text(
                              location,
                              style: GoogleFonts.ibmPlexSansArabic(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    const Spacer(),
                    // Enhanced Send Interest Button (for normal users) or Shortlist Button (for agents)
                    GestureDetector(
                      onTap: () async {
                        if (isAgent) {
                          await _agentShortlist(name, userId);
                        } else {
                          await _sendInterest(name, userId);
                        }
                      },
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: isAgent
                                ? (shortlistedUserIds.contains(userId)
                                    ? [
                                        Colors.grey,
                                        Colors.grey.shade600
                                      ] // Already shortlisted
                                    : [
                                        Colors.orange,
                                        Colors.deepOrangeAccent
                                      ]) // Not shortlisted
                                : [themeColor, themeColor.withOpacity(0.8)],
                          ),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: isAgent
                                  ? (shortlistedUserIds.contains(userId)
                                      ? Colors.grey.withOpacity(0.3)
                                      : Colors.orange.withOpacity(0.3))
                                  : themeColor.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            AnimatedBuilder(
                              animation: _shortlistAnimationController,
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: shortlistedUserIds.contains(userId)
                                      ? _shortlistScaleAnimation.value
                                      : 1.0,
                                  child: Icon(
                                    isAgent
                                        ? (shortlistedUserIds.contains(userId)
                                            ? Icons
                                                .star // Filled star if shortlisted
                                            : Icons
                                                .star_border) // Empty star if not shortlisted
                                        : Icons.favorite_border,
                                    size: 16,
                                    color: Colors.white,
                                  ),
                                );
                              },
                            ),
                            const SizedBox(width: 6),
                            AnimatedBuilder(
                              animation: _shortlistAnimationController,
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: shortlistedUserIds.contains(userId)
                                      ? _shortlistScaleAnimation.value
                                      : 1.0,
                                  child: Text(
                                    isAgent
                                        ? (shortlistedUserIds.contains(userId)
                                            ? 'Shortlisted'
                                            : 'Shortlist')
                                        : 'Send Interest',
                                    style: GoogleFonts.ibmPlexSansArabic(
                                      fontSize: 13,
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Modern "See All" button with enhanced styling
  Widget _buildSeeAllButton(String title, Color themeColor) {
    return Center(
      child: GestureDetector(
        onTap: () {
          debugPrint('See All Profiles pressed for $title');
          _navigateToAllProfiles(title);
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                themeColor.withOpacity(0.1),
                themeColor.withOpacity(0.05),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: themeColor.withOpacity(0.3)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'SEE ALL PROFILES',
                style: GoogleFonts.ibmPlexSansArabic(
                  color: themeColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.arrow_forward_ios,
                color: themeColor,
                size: 14,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Navigate to all profiles screen based on section type
  void _navigateToAllProfiles(String sectionTitle) {
    String profileType = 'trending'; // default

    debugPrint('🔄 DEBUG: Section title received: "$sectionTitle"');

    if (sectionTitle.toLowerCase().contains('trending')) {
      profileType = 'trending';
      debugPrint('🔄 DEBUG: Setting profile type to: trending');
    } else if (sectionTitle.toLowerCase().contains('latest')) {
      profileType = 'latest';
      debugPrint('🔄 DEBUG: Setting profile type to: latest');
    } else if (sectionTitle.toLowerCase().contains('recommendations')) {
      profileType = 'recommended';
      debugPrint('🔄 DEBUG: Setting profile type to: recommended');
    } else {
      debugPrint('🔄 DEBUG: No match found, using default: trending');
    }

    // Determine the correct agentId to pass based on user type
    String? agentIdToPass;
    if (isAgentImpersonating) {
      // Agent is impersonating a user - don't pass agent ID (null)
      agentIdToPass = null;
      debugPrint('🔄 Agent impersonating - passing agentId: null (user mode)');
    } else if (isAgent) {
      // Normal agent mode - pass agent ID
      agentIdToPass = agentId?.toString();
      debugPrint('🔄 Normal agent mode - passing agentId: $agentIdToPass');
    } else {
      // Normal user mode - don't pass agent ID (null)
      agentIdToPass = null;
      debugPrint('🔄 Normal user mode - passing agentId: null');
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AllProfilesScreen(
          profileType: profileType,
          agentId: agentIdToPass,
        ),
      ),
    );
  }

  // iOS style floating card bottom navigation bar
  Widget _buildModernBottomNavBar() {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 25),
      child: Container(
        height: 70,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.95),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: Colors.grey.shade200.withOpacity(0.6),
            width: 0.5,
          ),
          boxShadow: [
            // Main shadow for depth
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 25,
              offset: const Offset(0, 8),
            ),
            // Secondary shadow for iOS-like depth
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
            // Subtle inner highlight (iOS glassmorphism)
            BoxShadow(
              color: Colors.white.withOpacity(0.8),
              blurRadius: 1,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(25),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildModernTabItem(
                  icon: Icons.home_outlined,
                  activeIcon: Icons.home,
                  label: 'Home',
                  index: 0,
                ),
                _buildModernTabItem(
                  icon: Icons.favorite_border,
                  activeIcon: Icons.favorite,
                  label: 'Activity',
                  index: 1,
                ),
                _buildModernTabItem(
                  icon: Icons.search,
                  activeIcon: Icons.search,
                  label: 'Search',
                  index: 2,
                ),
                _buildModernTabItem(
                  icon: Icons.chat_bubble_outline,
                  activeIcon: Icons.chat_bubble,
                  label: 'Messages',
                  index: 3,
                ),
                _buildModernTabItem(
                  icon: Icons.person_outline,
                  activeIcon: Icons.person,
                  label: 'Profile',
                  index: 4,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // iOS style tab item for floating card
  Widget _buildModernTabItem({
    required IconData icon,
    required IconData activeIcon,
    required String label,
    required int index,
  }) {
    final bool isActive = _selectedIndex == index;
    final bool isMessagesTab = index == 3;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          if (index == 4) {
            // Profile tab pe click hua, toh ProfileScreen par redirect karo
            Navigator.pushNamed(context, '/profile');
          } else if (index == 3) {
            // Messages tab pe click hua, toh ChatScreen par redirect karo
            Navigator.pushNamed(context, '/chat');
          } else {
            setState(() {
              _selectedIndex = index;
            });
          }
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon with iOS-style background and notification badge
              Stack(
                children: [
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: isActive
                          ? Colors.pink.withOpacity(0.12)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      isActive ? activeIcon : icon,
                      size: 22,
                      color: isActive ? Colors.pink : Colors.grey.shade600,
                    ),
                  ),
                  // Notification badge for Messages tab
                  if (isMessagesTab && unreadMessageCount > 0)
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 4, vertical: 2),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.pink.shade400,
                              Colors.pink.shade600
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.pink.shade200.withOpacity(0.3),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 18,
                          minHeight: 18,
                        ),
                        child: Text(
                          unreadMessageCount > 99
                              ? '99+'
                              : unreadMessageCount.toString(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 3),
              // Label with iOS typography
              Text(
                label,
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 10,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                  color: isActive ? Colors.pink : Colors.grey.shade600,
                  letterSpacing: -0.1,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Professional industry-standard drawer
  Widget _buildModernDrawer() {
    return Drawer(
      backgroundColor: Colors.white,
      elevation: 0,
      child: SafeArea(
        child: Column(
          children: [
            // Professional Header
            _buildProfessionalHeader(),
            // Menu Items with proper spacing
            Expanded(
              child: _buildProfessionalMenuItems(),
            ),
            // Clean Footer
            _buildProfessionalFooter(),
          ],
        ),
      ),
    );
  }

  // Professional clean header
  Widget _buildProfessionalHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Colors.grey.shade100, width: 1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Professional user profile with photo and edit option
          Row(
            children: [
              // User photo container with edit pencil overlay
              Stack(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200, width: 1),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: _buildUserPhoto(),
                    ),
                  ),
                  // Edit pencil button overlay
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.pop(context);
                        _navigateToProfileEdit();
                      },
                      child: Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          color: Colors.pink.shade600,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 1.5),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 4,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.edit,
                          color: Colors.white,
                          size: 10,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      userName,
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey.shade900,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      isProfileComplete
                          ? 'Profile Complete'
                          : 'Profile Incomplete',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 14,
                        color: isProfileComplete
                            ? Colors.green.shade600
                            : Colors.orange.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Professional menu items with expandable My Profile submenu
  Widget _buildProfessionalMenuItems() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 16),
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        // // Home
        // _buildProfessionalMenuItem(
        //   icon: Icons.home_outlined,
        //   title: 'Home',
        //   onTap: () {
        //     Navigator.pop(context);
        //     debugPrint('Home pressed');
        //   },
        // ),
        // Divider(color: Colors.grey.shade100, height: 1, thickness: 0.5),
        // My Profile (expandable)
        _buildExpandableProfileMenuItem(),
        Divider(color: Colors.grey.shade100, height: 1, thickness: 0.5),
        // My Interests
        _buildProfessionalMenuItem(
          icon: Icons.favorite_border,
          title: 'My Interests',
          onTap: () {
            Navigator.pop(context);
            debugPrint('My Interests pressed');
            // Navigate to Interest Details Screen
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => InterestDetailsScreen(
                  title: 'My Interests',
                  receivedCount: 0, // Default value, will be updated from API
                  sentCount: 0, // Default value, will be updated from API
                ),
              ),
            );
          },
        ),
        Divider(color: Colors.grey.shade100, height: 1, thickness: 0.5),
        // Messages
        _buildProfessionalMenuItem(
          icon: Icons.chat_bubble_outline,
          title: 'Messages',
          onTap: () {
            Navigator.pop(context);
            debugPrint('Messages pressed');
          },
        ),
        Divider(color: Colors.grey.shade100, height: 1, thickness: 0.5),
        // Advanced Search
        _buildProfessionalMenuItem(
          icon: Icons.search,
          title: 'Advanced Search',
          onTap: () {
            Navigator.pop(context);
            debugPrint('Advanced Search pressed');
          },
        ),
        Divider(color: Colors.grey.shade100, height: 1, thickness: 0.5),
        // Help & Support (expandable)
        _buildExpandableHelpSupportMenuItem(),
        Divider(color: Colors.grey.shade100, height: 1, thickness: 0.5),
        // Settings
        _buildProfessionalMenuItem(
          icon: Icons.settings_outlined,
          title: 'Settings',
          onTap: () {
            Navigator.pop(context);
            debugPrint('Settings pressed');
            // Navigate to Settings page
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const SettingsScreen(),
              ),
            );
          },
        ),
        // Extra space for better scrolling indication
        SizedBox(height: 20),
      ],
    );
  }

  // My Profile expandable menu item
  Widget _buildExpandableProfileMenuItem() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          onTap: () {
            setState(() {
              isProfileMenuExpanded = !isProfileMenuExpanded;
            });
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              children: [
                Icon(Icons.person_outline,
                    color: Colors.grey.shade700, size: 22),
                const SizedBox(width: 20),
                Expanded(
                  child: Text(
                    'Profile',
                    style: GoogleFonts.ibmPlexSansArabic(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade900,
                      letterSpacing: -0.2,
                    ),
                  ),
                ),
                Icon(
                  isProfileMenuExpanded ? Icons.expand_less : Icons.expand_more,
                  color: Colors.pink.shade600, // Orange arrow
                  size: 22,
                ),
              ],
            ),
          ),
        ),
        if (isProfileMenuExpanded)
          Container(
            margin: const EdgeInsets.only(bottom: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildProfileSubMenuItem(
                  title: 'Edit My Profile',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Edit My Profile pressed');
                    _navigateToProfileEdit();
                  },
                ),
                SizedBox(height: 4),
                _buildProfileSubMenuItem(
                  title: 'Gallery',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Gallery pressed');
                    // Navigate to Gallery screen
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const GalleryScreen(),
                      ),
                    );
                  },
                ),
                SizedBox(height: 4),
                _buildProfileSubMenuItem(
                  title: 'Add Trust Badge',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Add Trust Badge pressed');
                  },
                ),
                SizedBox(height: 4),
                _buildProfileSubMenuItem(
                  title: 'My Package',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('My Package pressed');
                  },
                ),
              ],
            ),
          ),
      ],
    );
  }

  // Submenu item builder for My Profile (NO ICON, left indent, bold)
  Widget _buildProfileSubMenuItem({
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.fromLTRB(48, 12, 12, 12), // left indent
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: GoogleFonts.ibmPlexSansArabic(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade900,
          ),
        ),
      ),
    );
  }

  // Help & Support expandable menu item
  Widget _buildExpandableHelpSupportMenuItem() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          onTap: () {
            setState(() {
              isHelpSupportMenuExpanded = !isHelpSupportMenuExpanded;
            });
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              children: [
                Icon(Icons.help_outline, color: Colors.grey.shade700, size: 22),
                const SizedBox(width: 20),
                Expanded(
                  child: Text(
                    'Help & Support',
                    style: GoogleFonts.ibmPlexSansArabic(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade900,
                      letterSpacing: -0.2,
                    ),
                  ),
                ),
                Icon(
                  isHelpSupportMenuExpanded
                      ? Icons.expand_less
                      : Icons.expand_more,
                  color: Colors.pink.shade600, // Pink arrow
                  size: 22,
                ),
              ],
            ),
          ),
        ),
        if (isHelpSupportMenuExpanded)
          Container(
            margin: const EdgeInsets.only(bottom: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHelpSupportSubMenuItem(
                  title: 'Contact Us',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Contact Us pressed');
                    // Navigate to Contact Us screen
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ContactUsPage(),
                      ),
                    );
                  },
                ),
                SizedBox(height: 4),
                _buildHelpSupportSubMenuItem(
                  title: 'About Us',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('About Us pressed');
                    // Navigate to About Us screen
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AboutUsPage(),
                      ),
                    );
                  },
                ),
                SizedBox(height: 4),
                _buildHelpSupportSubMenuItem(
                  title: 'Blogs',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Blogs pressed');
                    // TODO: Navigate to Blogs screen
                  },
                ),
                SizedBox(height: 4),
                _buildHelpSupportSubMenuItem(
                  title: 'Report Bugs',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Report Bugs pressed');
                    // Navigate to Report Bugs screen
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ReportBugsPage(),
                      ),
                    );
                  },
                ),
                SizedBox(height: 4),
                _buildHelpSupportSubMenuItem(
                  title: 'Terms & Conditions',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Terms & Conditions pressed');
                    // Navigate to Terms & Conditions screen
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TermsConditionsPage(),
                      ),
                    );
                  },
                ),
                SizedBox(height: 4),
                _buildHelpSupportSubMenuItem(
                  title: 'Privacy Policy',
                  onTap: () {
                    Navigator.pop(context);
                    debugPrint('Privacy Policy pressed');
                    // Navigate to Privacy Policy screen
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PrivacyPolicyPage(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
      ],
    );
  }

  // Submenu item builder for Help & Support (NO ICON, left indent, bold)
  Widget _buildHelpSupportSubMenuItem({
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.fromLTRB(48, 12, 12, 12), // left indent
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: GoogleFonts.ibmPlexSansArabic(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade900,
          ),
        ),
      ),
    );
  }

  // Professional clean menu item
  Widget _buildProfessionalMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: [
              Icon(
                icon,
                color: Colors.grey.shade700,
                size: 22,
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.ibmPlexSansArabic(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade900,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                color: Colors.grey.shade400,
                size: 14,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Build user photo widget with fallback to gender-based placeholder
  Widget _buildUserPhoto() {
    debugPrint('🖼️ Building user photo widget...');
    debugPrint('📸 User photo URL: $userPhoto');
    debugPrint('👤 User gender: $userGender');

    // Agar user photo hai toh network image dikhao
    if (userPhoto != null && userPhoto!.isNotEmpty) {
      debugPrint('✅ Showing network image: $userPhoto');
      return Image.network(
        userPhoto!,
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
        errorBuilder: (context, error, stackTrace) {
          debugPrint('❌ Network image error: $error');
          debugPrint('🔄 Falling back to gender placeholder');
          return _buildGenderBasedPlaceholder();
        },
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) {
            debugPrint('✅ Image loaded successfully');
            return child;
          }
          debugPrint('⏳ Loading image: ' +
              (((loadingProgress.cumulativeBytesLoaded /
                          (loadingProgress.expectedTotalBytes ?? 1)) *
                      100)
                  .toStringAsFixed(1)) +
              '%');
          return Container(
            color: Colors.grey.shade100,
            child: Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                    : null,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.pink.shade400),
                strokeWidth: 2,
              ),
            ),
          );
        },
      );
    }

    // Agar photo nahi hai toh gender-based placeholder dikhao
    debugPrint('🔄 No photo available, showing gender placeholder');
    return _buildGenderBasedPlaceholder();
  }

  // Build gender-based placeholder image
  Widget _buildGenderBasedPlaceholder() {
    if (userGender.toLowerCase() == 'female') {
      return Image.asset(
        'assets/images/hijab-woman.png',
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
      );
    } else if (userGender.toLowerCase() == 'male') {
      return Image.asset(
        'assets/images/muslim-man.png',
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
      );
    } else {
      // Default placeholder for unknown gender
      return Container(
        color: Colors.grey.shade100,
        child: Icon(
          Icons.person,
          color: Colors.grey.shade400,
          size: 28,
        ),
      );
    }
  }

  // Navigate to profile edit screen
  void _navigateToProfileEdit() async {
    debugPrint(
        '🎯 Navigating to profile details (edit) from homepage drawer...');
    final userProfile =
        await ProfileService.fetchUserProfile(userId: currentUserId);
    if (userProfile != null && mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ProfileDetailsScreen(
            userData: userProfile,
            currentUserGender: userGender,
            currentUserId: currentUserId,
          ),
        ),
      );
    }
  }

  // Professional clean footer
  Widget _buildProfessionalFooter() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: Colors.grey.shade100, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Professional Logout
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                Navigator.pop(context);
                _showLogoutConfirmation();
              },
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.logout, color: Colors.red.shade600, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Logout',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.red.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Clean app version
          Text(
            'Version 1.0.0',
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 12,
              color: Colors.grey.shade500,
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  // Filter icon pe click karne par yeh function bottom sheet kholega
  void _showFilterBottomSheet() {
    RangeValues tempAgeRange = _filterAgeRange;
    String? tempCountry = _filterCountry;
    String? tempState = _filterState;
    String? tempCity = _filterCity;
    String? tempProfession = _filterProfession;
    String? tempEducation = _filterEducation;
    String? tempMaritalStatus = _filterMaritalStatus;

    // Location field update helper
    void updateLocationField() {
      if (tempCountry != null && tempState != null && tempCity != null) {
        _filterLocationController.text = '$tempCountry, $tempState, $tempCity';
      } else {
        _filterLocationController.text = '';
      }
    }

    updateLocationField();

    // Profession/Education picker open logic (step3_1.dart style)
    void openPicker({
      required String title,
      required List<String> options,
      required String? selectedValue,
      required Function(String) onSelected,
    }) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (_) => GenericPicker(
          title: title,
          options: options,
          pickerType: PickerType.single,
          selectedValue: selectedValue,
          onSelectionChanged: (val) {
            onSelected(val);
          },
        ),
      );
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            // Modern & professional filter UI
            return Container(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 20,
                    offset: Offset(0, -5),
                  ),
                ],
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        margin: EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    Text(
                      'Filter Profiles',
                      style: GoogleFonts.ibmPlexSansArabic(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.pink.shade600,
                      ),
                    ),
                    SizedBox(height: 20),
                    // Age Range - Modern RangeSlider
                    Text('Age Range',
                        style: GoogleFonts.ibmPlexSansArabic(
                            fontWeight: FontWeight.w600)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('${tempAgeRange.start.round()} yrs',
                            style: GoogleFonts.ibmPlexSansArabic(fontSize: 13)),
                        Text('${tempAgeRange.end.round()} yrs',
                            style: GoogleFonts.ibmPlexSansArabic(fontSize: 13)),
                      ],
                    ),
                    RangeSlider(
                      values: tempAgeRange,
                      min: 18,
                      max: 60,
                      divisions: 42,
                      activeColor: Colors.pink.shade600,
                      inactiveColor: Colors.pink.shade100,
                      onChanged: (RangeValues values) {
                        setModalState(() {
                          tempAgeRange = values;
                        });
                      },
                    ),
                    SizedBox(height: 16),
                    // Location field (step1.dart style)
                    Text('Location',
                        style: GoogleFonts.ibmPlexSansArabic(
                            fontWeight: FontWeight.w600)),
                    GestureDetector(
                      onTap: () async {
                        final result =
                            await showModalBottomSheet<Map<String, String?>>(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (_) => const LocationPicker(),
                        );
                        if (result != null) {
                          setModalState(() {
                            tempCountry = result['country'];
                            tempState = result['state'];
                            tempCity = result['city'];
                            updateLocationField();
                          });
                        }
                      },
                      child: AbsorbPointer(
                        child: TextFormField(
                          controller: _filterLocationController,
                          decoration: InputDecoration(
                            hintText: 'Select location',
                            border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12)),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: Colors.pink, width: 2),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey),
                            ),
                            suffixIcon: const Icon(Icons.keyboard_arrow_down),
                          ),
                          readOnly: true,
                          style: GoogleFonts.ibmPlexSansArabic(
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    SizedBox(height: 16),
                    // Profession Picker (step3_1.dart style)
                    Text('Profession',
                        style: GoogleFonts.ibmPlexSansArabic(
                            fontWeight: FontWeight.w600)),
                    GestureDetector(
                      onTap: () {
                        openPicker(
                          title: 'Profession',
                          options: _professionList,
                          selectedValue: tempProfession,
                          onSelected: (val) {
                            setModalState(() {
                              tempProfession = val;
                            });
                          },
                        );
                      },
                      child: Container(
                        margin: EdgeInsets.only(top: 4, bottom: 12),
                        padding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                tempProfession ?? 'Select Profession',
                                style: GoogleFonts.ibmPlexSansArabic(
                                  color: tempProfession != null
                                      ? Colors.black
                                      : Colors.grey,
                                ),
                              ),
                            ),
                            const Icon(Icons.arrow_drop_down,
                                color: Colors.grey),
                          ],
                        ),
                      ),
                    ),
                    // Education Picker (step3_1.dart style)
                    Text('Education',
                        style: GoogleFonts.ibmPlexSansArabic(
                            fontWeight: FontWeight.w600)),
                    GestureDetector(
                      onTap: () {
                        openPicker(
                          title: 'Education',
                          options: _educationList,
                          selectedValue: tempEducation,
                          onSelected: (val) {
                            setModalState(() {
                              tempEducation = val;
                            });
                          },
                        );
                      },
                      child: Container(
                        margin: EdgeInsets.only(top: 4, bottom: 12),
                        padding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                tempEducation ?? 'Select Education',
                                style: GoogleFonts.ibmPlexSansArabic(
                                  color: tempEducation != null
                                      ? Colors.black
                                      : Colors.grey,
                                ),
                              ),
                            ),
                            const Icon(Icons.arrow_drop_down,
                                color: Colors.grey),
                          ],
                        ),
                      ),
                    ),
                    // Marital Status Pills/Chips (gender-based dynamic)
                    Text('Select Marital Status',
                        style: GoogleFonts.ibmPlexSansArabic(
                            fontWeight: FontWeight.w600)),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children:
                          _getMaritalStatusOptionsForFilter().map((status) {
                        final bool selected = tempMaritalStatus == status;
                        return ChoiceChip(
                          label: Text(status),
                          selected: selected,
                          selectedColor: Colors.pink.shade600,
                          backgroundColor: Colors.white,
                          labelStyle: GoogleFonts.ibmPlexSansArabic(
                            color: selected ? Colors.white : Colors.black87,
                            fontWeight: FontWeight.w600,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                            side: BorderSide(
                              color: selected
                                  ? Colors.pink.shade600
                                  : Colors.grey.shade400,
                              width: 1.5,
                            ),
                          ),
                          onSelected: (val) {
                            setModalState(() {
                              tempMaritalStatus = status;
                            });
                          },
                        );
                      }).toList(),
                    ),
                    SizedBox(height: 24),
                    // Apply Filter Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () async {
                          setState(() {
                            _filterAgeRange = tempAgeRange;
                            _filterCountry = tempCountry;
                            _filterState = tempState;
                            _filterCity = tempCity;
                            _filterProfession = tempProfession;
                            _filterEducation = tempEducation;
                            _filterMaritalStatus = tempMaritalStatus;
                            _isFilterApplied = true;
                          });
                          Navigator.of(context).pop();
                          await _applyProfileFilters();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.pink.shade600,
                          padding: EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Apply Filter',
                          style: GoogleFonts.ibmPlexSansArabic(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 10),
                    // Clear Filter Button
                    if (_isFilterApplied)
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() {
                              _filterAgeRange = const RangeValues(18, 40);
                              _filterCountry = null;
                              _filterState = null;
                              _filterCity = null;
                              _filterProfession = null;
                              _filterEducation = null;
                              _filterMaritalStatus = null;
                              _isFilterApplied = false;
                              _filteredProfiles = [];
                              _filterLocationController.clear();
                            });
                            Navigator.of(context).pop();
                          },
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Colors.pink.shade600),
                            padding: EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            'Clear Filter',
                            style: GoogleFonts.ibmPlexSansArabic(
                              color: Colors.pink.shade600,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // Yeh function backend se filtered profiles laayega ya local filter lagayega
  Future<void> _applyProfileFilters() async {
    setState(() {
      _isLoadingFilter = true;
    });
    try {
      // Backend se filtered profiles laane ka example (API bana ho toh)
      final filtered = await ProfileService.fetchFilteredProfiles(
        userId: currentUserId,
        minAge: _filterAgeRange.start.round(),
        maxAge: _filterAgeRange.end.round(),
        city: _filterCity,
        profession: _filterProfession,
        maritalStatus: _filterMaritalStatus,
        // Education, country, state backend pe add karna ho toh yahan bhej sakte hain
      );
      setState(() {
        _filteredProfiles = filtered
            .map((profile) => ProfileService.formatProfileForUI(profile))
            .toList();
        _isLoadingFilter = false;
      });
    } catch (e) {
      debugPrint('Error applying filters: $e');
      setState(() {
        _filteredProfiles = [];
        _isLoadingFilter = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to apply filter',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  // Debug info banner - Removed for production

  // Profile card menu options method - yeh menu button add karega cards mein
  // Modern professional UI jaisa top-notch companies banate hain
  Widget _buildProfileCardMenu({
    required String userId,
    required String userName,
    required Color themeColor,
    required Map<String, dynamic> profileData,
  }) {
    // Check if this user is shortlisted
    final isShortlisted = shortlistedUserIds.contains(userId);
    return PopupMenuButton<String>(
      icon: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.95),
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 3),
              spreadRadius: 1,
            ),
          ],
        ),
        child: Icon(
          Icons.more_horiz,
          color: themeColor,
          size: 20,
        ),
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 12,
      offset: const Offset(0, 10),
      color: Colors.white,
      surfaceTintColor: Colors.transparent,
      shadowColor: Colors.black.withOpacity(0.2),
      onSelected: (value) async {
        await _handleMenuOption(value, userId, userName, profileData);
      },
      itemBuilder: (BuildContext context) => [
        // Shortlist option - Star icon for individual members
        PopupMenuItem<String>(
          value: 'shortlist',
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: shortlistedUserIds.contains(userId)
                        ? (isAgent
                            ? Colors.amber.withOpacity(0.1)
                            : Colors.pink.withOpacity(0.1))
                        : Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: AnimatedBuilder(
                    animation: _shortlistAnimationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: shortlistedUserIds.contains(userId)
                            ? _shortlistScaleAnimation.value
                            : 1.0,
                        child: Icon(
                          shortlistedUserIds.contains(userId)
                              ? Icons.star_rounded
                              : Icons.star_outline_rounded,
                          color: shortlistedUserIds.contains(userId)
                              ? (isAgent
                                  ? Colors.amber.shade600
                                  : Colors.pink.shade500)
                              : Colors.grey.shade600,
                          size: 22,
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AnimatedBuilder(
                        animation: _shortlistAnimationController,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: shortlistedUserIds.contains(userId)
                                ? _shortlistScaleAnimation.value
                                : 1.0,
                            child: Text(
                              shortlistedUserIds.contains(userId)
                                  ? 'Remove from Shortlist'
                                  : 'Add to Shortlist',
                              style: GoogleFonts.ibmPlexSansArabic(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey.shade800,
                              ),
                            ),
                          );
                        },
                      ),
                      Text(
                        shortlistedUserIds.contains(userId)
                            ? 'Remove from your favorites'
                            : 'Save to your favorites',
                        style: GoogleFonts.ibmPlexSansArabic(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        // Chat Now option - sirf normal users ke liye
        if (!isAgent)
          PopupMenuItem<String>(
            value: 'chat',
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.chat_bubble_rounded,
                      color: Colors.blue.shade600,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Chat Now',
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey.shade800,
                          ),
                        ),
                        Text(
                          'Start a conversation',
                          style: GoogleFonts.ibmPlexSansArabic(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        // Report option
        PopupMenuItem<String>(
          value: 'report',
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.report_rounded,
                    color: Colors.orange.shade600,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Report Profile',
                        style: GoogleFonts.ibmPlexSansArabic(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade800,
                        ),
                      ),
                      Text(
                        'Report inappropriate content',
                        style: GoogleFonts.ibmPlexSansArabic(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        // Block option
        PopupMenuItem<String>(
          value: 'block',
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.block_rounded,
                    color: Colors.red.shade600,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Block User',
                        style: GoogleFonts.ibmPlexSansArabic(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade800,
                        ),
                      ),
                      Text(
                        'Block and hide from feed',
                        style: GoogleFonts.ibmPlexSansArabic(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // Handle menu option selection
  Future<void> _handleMenuOption(
    String option,
    String userId,
    String userName,
    Map<String, dynamic> profileData,
  ) async {
    switch (option) {
      case 'shortlist':
        if (isAgent) {
          await _agentShortlist(userName, userId);
        } else {
          await _handleShortlist(userId, userName);
        }
        break;
      case 'chat':
        await _handleChat(userId, userName, profileData);
        break;
      case 'report':
        await _handleReport(userId, userName);
        break;
      case 'block':
        await _handleBlock(userId, userName);
        break;
    }
  }

  // Handle shortlist for normal users
  Future<void> _handleShortlist(String userId, String userName) async {
    try {
      // Check if user is already shortlisted
      final bool isCurrentlyShortlisted = shortlistedUserIds.contains(userId);

      if (isCurrentlyShortlisted) {
        // Remove from shortlist - backend call
        final response = await ProfileService.removeFromShortlist(
          fromUserId: currentUserId,
          toUserId: userId,
        );

        if (response['success'] == true) {
          // Update local state immediately for better UX
          setState(() {
            shortlistedUserIds.remove(userId);
          });

          // Trigger animation for removal feedback
          _shortlistAnimationController.forward().then((_) {
            _shortlistAnimationController.reverse();
          });

          // Show success feedback
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '$userName removed from shortlist',
                  style: GoogleFonts.ibmPlexSansArabic(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: Colors.orange,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                duration: const Duration(seconds: 2),
              ),
            );
          }
        } else {
          // Show error feedback
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'Failed to remove from shortlist: ${response['message']}',
                  style: GoogleFonts.ibmPlexSansArabic(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            );
          }
          return; // Don't update UI if backend failed
        }
      } else {
        // Add to shortlist - backend call
        final response = await ProfileService.addToShortlist(
          fromUserId: currentUserId,
          toUserId: userId,
          toUserName: userName,
        );

        if (response['success'] == true) {
          // Update local state immediately for better UX
          setState(() {
            shortlistedUserIds.add(userId);
          });

          // Trigger shortlist animation
          _shortlistAnimationController.forward().then((_) {
            _shortlistAnimationController.reverse();
          });

          // Show success feedback
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '$userName added to shortlist!',
                  style: GoogleFonts.ibmPlexSansArabic(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: Colors.green,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                duration: const Duration(seconds: 2),
              ),
            );
          }
        } else {
          // Show error feedback
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'Failed to add to shortlist: ${response['message']}',
                  style: GoogleFonts.ibmPlexSansArabic(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            );
          }
          return; // Don't update UI if backend failed
        }
      }

      // Note: setState() already called above for immediate UI updates

      // Optional: Refresh shortlist status from backend for consistency
      // Uncomment the line below if you want to ensure backend sync
      // await _refreshShortlistStatus(userId);
    } catch (e) {
      debugPrint('❌ Error shortlisting user: $e');

      // Show error feedback
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Network error. Please try again.',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  // Handle chat functionality
  Future<void> _handleChat(
      String userId, String userName, Map<String, dynamic> profileData) async {
    try {
      debugPrint('Opening chat with: $userName (ID: $userId)');

      // Navigate to individual chat screen
      if (mounted) {
        // First check if there's an existing conversation with this user
        final existingConversationId = await _getExistingConversationId(userId);

        // Use existing conversation ID if available, otherwise generate new one
        final conversationId = existingConversationId ??
            _generateConversationId(currentUserId, userId);

        // Determine profile image based on available data
        final String profileImage = _getProfileImageUrl(profileData);
        final bool isVerified = profileData['is_verified'] ?? false;
        final bool isOnline = profileData['is_online'] ?? false;

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => IndividualChatScreen(
              userName: userName,
              userProfileImage: profileImage,
              isVerified: isVerified,
              isOnline: isOnline,
              userId: userId,
              conversationId: conversationId,
            ),
          ),
        );
      }
    } catch (e) {
      debugPrint('Error opening chat: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Error opening chat: $e',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  // Generate conversation ID for chat
  String _generateConversationId(String currentUserId, String targetUserId) {
    // Sort IDs to ensure consistent conversation ID regardless of who initiates
    final sortedIds = [currentUserId, targetUserId]..sort();
    return '${sortedIds[0]}_${sortedIds[1]}';
  }

  // Check if there's an existing conversation with a user
  Future<String?> _getExistingConversationId(String targetUserId) async {
    try {
      // Get all existing conversations
      final conversations = await ChatService.getConversations();

      // Look for conversation with this user
      for (final conversation in conversations) {
        if (conversation.userId == targetUserId) {
          // Found existing conversation, return its ID
          return conversation.id;
        }
      }

      // No existing conversation found
      return null;
    } catch (e) {
      debugPrint('Error checking existing conversation: $e');
      return null;
    }
  }

  // Get profile image URL based on available data
  String _getProfileImageUrl(Map<String, dynamic> profileData) {
    // First check if user has uploaded photo
    if (profileData['upload_photo'] != null &&
        profileData['upload_photo'].toString().isNotEmpty) {
      return profileData['upload_photo'].toString();
    }

    // If no uploaded photo, check gender and use default assets
    final String gender = profileData['gender']?.toString().toLowerCase() ?? '';

    if (gender == 'male') {
      return 'assets/images/muslim-man.png';
    } else if (gender == 'female') {
      return 'assets/images/hijab-woman.png';
    } else {
      // Default to male image if gender is unknown
      return 'assets/images/muslim-man.png';
    }
  }

  // Handle report functionality
  Future<void> _handleReport(String userId, String userName) async {
    try {
      debugPrint('Reporting user: $userName (ID: $userId)');

      // Show report dialog

      if (mounted) {
        _showReportDialog(userId, userName);
      }
    } catch (e) {
      debugPrint('Error reporting user: $e');
    }
  }

  // Handle block functionality
  Future<void> _handleBlock(String userId, String userName) async {
    try {
      debugPrint('Blocking user: $userName (ID: $userId)');

      // Show block confirmation dialog
      if (mounted) {
        _showBlockConfirmationDialog(userId, userName);
      }
    } catch (e) {
      debugPrint('Error blocking user: $e');
    }
  }

  // Show report dialog
  void _showReportDialog(String userId, String userName) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: [
              Icon(
                Icons.report_outlined,
                color: Colors.orange.shade600,
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                'Report Profile',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Report $userName\'s profile for:',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
              ),
              const SizedBox(height: 16),
              _buildReportOption('Inappropriate Content', Icons.warning),
              _buildReportOption('Fake Profile', Icons.person_off),
              _buildReportOption('Spam', Icons.block),
              _buildReportOption('Harassment', Icons.security),
              _buildReportOption('Other', Icons.more_horiz),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Report submitted successfully!',
                      style: GoogleFonts.ibmPlexSansArabic(
                        color: Colors.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    backgroundColor: Colors.green,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange.shade600,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Submit Report',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  // Build report option
  Widget _buildReportOption(String text, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, color: Colors.grey.shade600, size: 20),
          const SizedBox(width: 12),
          Text(
            text,
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 14,
              color: Colors.grey.shade700,
            ),
          ),
        ],
      ),
    );
  }

  // Perform actual block user API call
  Future<void> _performBlockUser(String userId, String userName) async {
    try {
      // Calling block API for user

      // Get current user ID from local variable
      if (currentUserId.isEmpty) {
        throw Exception('Current user ID not found');
      }

      // Make API call to block user
      final response = await http.post(
        Uri.parse('${ProfileService.baseUrl}/recieved/block/'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'action_by_id': currentUserId,
          'action_on_id': userId,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['success'] == true) {
          // Show success message
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '$userName has been blocked successfully!',
                  style: GoogleFonts.ibmPlexSansArabic(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                duration: const Duration(seconds: 3),
              ),
            );
          }

          // Optionally refresh the profile list to hide blocked user
          // You can implement this based on your requirements
          // User blocked successfully
        } else {
          throw Exception(responseData['message'] ?? 'Failed to block user');
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      // Error blocking user

      // Show error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to block user: $e',
              style: GoogleFonts.ibmPlexSansArabic(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            duration: const Duration(seconds: 4),
          ),
        );
      }
    }
  }

  // Show block confirmation dialog
  void _showBlockConfirmationDialog(String userId, String userName) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: [
              Icon(
                Icons.block,
                color: Colors.red.shade600,
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                'Block User',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
            ],
          ),
          content: Text(
            'Are you sure you want to block $userName? You won\'t see their profile anymore.',
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 16,
              color: Colors.grey.shade600,
              height: 1.4,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.of(context).pop();
                // Call block API
                await _performBlockUser(userId, userName);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade600,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Block',
                style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
