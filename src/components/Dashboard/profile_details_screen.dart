import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:ui';
import 'dart:convert';
import 'package:shimmer/shimmer.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../services/profile_service.dart'; // ProfileService import karo
import '../services/chat_service.dart'; // ChatService import karo
import 'package:mehram_match_app/screens/Forms/step1.dart'; // Step1FormScreen ka sahi import
import 'package:mehram_match_app/screens/Forms/step2form/step2.dart'; // Step2 ka sahi import
import 'package:mehram_match_app/screens/Forms/step3.dart'; // Step3 ka sahi import
import 'package:mehram_match_app/screens/Forms/step4.dart'; // Step4 ka sahi import
import 'package:mehram_match_app/screens/Forms/step3_1.dart'; // Step3_1FormScreen ka sahi import

// Profile Details Screen - Homepage style, modern, professional
class ProfileDetailsScreen extends StatefulWidget {
  final Map<String, dynamic> userData;
  final String currentUserGender; // Current user ka gender
  final String currentUserId; // Ab homepage se pass hoga
  const ProfileDetailsScreen(
      {Key? key,
      required this.userData,
      required this.currentUserGender,
      required this.currentUserId})
      : super(key: key);

  @override
  State<ProfileDetailsScreen> createState() => _ProfileDetailsScreenState();
}

class _ProfileDetailsScreenState extends State<ProfileDetailsScreen> {
  bool isSendingInterest = false; // Loading state for Send Interest
  bool isLoadingProfile = true; // Loading state for profile data

  // Gallery carousel variables
  PageController _pageController = PageController();
  int _currentPhotoIndex = 0;
  List<Map<String, dynamic>> _galleryPhotos = [];
  bool _isLoadingGallery = false;

  // Scroll controller for collapsing gallery
  ScrollController _scrollController = ScrollController();
  double _galleryHeight = 350.0; // Default gallery height
  double _maxGalleryHeight = 350.0; // Maximum gallery height
  double _minGalleryHeight =
      0.0; // Minimum gallery height (completely collapsed)
  bool _isGalleryCollapsed = false;

  // Naya: Interest status check karne ke liye ek function bana rahe hain
  Future<bool> _hasAlreadySentInterest() async {
    // Yeh function backend API se check karega ki current user ne iss profile ko interest bheja hai ya nahi
    try {
      // API endpoint: /api/user/interest_details/?user_id=profileId
      // Profile ka userId nikal lo
      final String profileId = widget.userData['id']?.toString() ??
          widget.userData['userId']?.toString() ??
          '';
      if (profileId.isEmpty) return false; // Safety check
      // ProfileService mein ek naya method bana lo ya yahan direct call karo
      final result = await ProfileService.checkInterestStatus(
        fromUserId: widget.currentUserId,
        toUserId: profileId,
      );
      // result true hai toh already bheja hua hai
      return result;
    } catch (e) {
      // Agar kuch error aaya toh assume karo nahi bheja (fail open)
      debugPrint('Interest status check error: ' + e.toString());
      return false;
    }
  }

  // Agent mode check karne ke liye
  bool _isAgentMode() {
    // Check if current user is an agent
    return widget.currentUserId.startsWith('agent_') ||
        widget.currentUserId.contains('agent') ||
        widget.userData['agent_verified'] == true;
  }

  // Handle chat now functionality
  Future<void> _handleChatNow() async {
    try {
      // Extract user data from widget.userData
      final String userId = widget.userData['id']?.toString() ??
          widget.userData['user_id']?.toString() ??
          '';
      final String userName = widget.userData['name']?.toString() ??
          widget.userData['first_name']?.toString() ??
          'User';
      final String profileImage =
          widget.userData['profile_photo']?.toString() ??
              'assets/images/muslim-man.png';
      final bool isVerified = widget.userData['is_verified'] ?? false;
      final bool isOnline = widget.userData['is_online'] ?? false;

      if (userId.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('User information not found.'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      // Start or get existing conversation
      final conversation = await ChatService.startConversation(
        userId: userId,
        userName: userName,
        profileImage: profileImage,
        isVerified: isVerified,
        isOnline: isOnline,
      );

      // Navigate to individual chat
      if (context.mounted) {
        Navigator.of(context).pushNamed(
          '/individual_chat',
          arguments: {
            'userName': conversation.name,
            'userProfileImage': conversation.profileImage,
            'isVerified': conversation.isVerified,
            'isOnline': conversation.isOnline,
            'userId': conversation.userId,
            'conversationId': conversation.id,
          },
        );
      }
    } catch (e) {
      print('Error starting chat: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to start chat. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Agent ke members fetch karne ke liye with gender filtering
  Future<List<Map<String, dynamic>>> _fetchAgentMembers() async {
    try {
      // Agent ID extract karo
      String agentId = widget.currentUserId;
      if (agentId.startsWith('agent_')) {
        agentId = agentId.replaceAll('agent_', '');
      }

      // Profile ka gender check karo for filtering
      final profileGender =
          widget.userData['gender']?.toString().toLowerCase() ?? '';
      String oppositeGender = '';

      if (profileGender == 'male') {
        oppositeGender = 'female';
        debugPrint('🎯 Profile is Male, fetching Female members');
      } else if (profileGender == 'female') {
        oppositeGender = 'male';
        debugPrint('🎯 Profile is Female, fetching Male members');
      } else {
        debugPrint('⚠️ Profile gender not found, fetching all members');
      }

      // Agent token fetch karo
      final prefs = await SharedPreferences.getInstance();
      final agentToken = prefs.getString('agent_token');

      if (agentToken == null) {
        debugPrint('❌ Agent token not found');
        return [];
      }

      // Agent ke members fetch karne ke liye API call with authentication
      final response = await http.get(
        Uri.parse(
            'https://mehrammatchbackend-production.up.railway.app/api/agent/user_agent/?agent_id=$agentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $agentToken',
        },
      );

      debugPrint('Agent Members API Response Status: ${response.statusCode}');
      debugPrint('Agent Members API Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        final List<dynamic> allMembers = responseData['member'] ?? [];

        debugPrint(
            '✅ Found ${allMembers.length} total members for agent $agentId');

        // Convert to List<Map<String, dynamic>> and filter by gender
        List<Map<String, dynamic>> filteredMembers = allMembers
            .map((member) => Map<String, dynamic>.from(member))
            .where((member) {
          final memberGender = member['gender']?.toString().toLowerCase() ?? '';

          // If opposite gender is specified, filter by it
          if (oppositeGender.isNotEmpty) {
            return memberGender == oppositeGender;
          }

          // If no gender specified, include all members
          return true;
        }).toList();

        debugPrint(
            '🎯 Filtered to ${filteredMembers.length} ${oppositeGender.isNotEmpty ? oppositeGender : 'all'} members');

        return filteredMembers;
      } else if (response.statusCode == 401) {
        debugPrint('❌ Agent authentication failed - token expired');
        return [];
      } else if (response.statusCode == 404) {
        debugPrint('❌ Agent members API not found - check URL');
        return [];
      } else {
        debugPrint('❌ Agent members API error: ${response.statusCode}');
        debugPrint('❌ Error response: ${response.body}');
        return [];
      }
    } catch (e) {
      debugPrint('❌ Error fetching agent members: $e');
      return [];
    }
  }

  // Agent ke liye interest bhejne ke liye bottom sheet show karne ka function
  Future<void> _showAgentInterestBottomSheet() async {
    try {
      // Agent ke members fetch karo
      final members = await _fetchAgentMembers();

      if (members.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.userData['gender'] != null
                  ? 'No ${widget.userData['gender']?.toString().toLowerCase() == 'male' ? 'Female' : 'Male'} members found. Please add some ${widget.userData['gender']?.toString().toLowerCase() == 'male' ? 'Female' : 'Male'} members first.'
                  : 'No members found. Please add some members first.',
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
        return;
      }

      debugPrint('✅ Showing bottom sheet with ${members.length} members');

      // Bottom sheet show karo with new implementation
      showModalBottomSheet(
        context: context,
        backgroundColor: Colors.transparent,
        isScrollControlled: true,
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.85,
        ),
        builder: (context) => _AgentMembersBottomSheet(
          members: members,
          targetUser: widget.userData,
          onInterestSent: (memberId) {
            // Handle interest sent successfully
            print('🎯 Interest sent from member: $memberId');
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Interest sent successfully! 🎉'),
                backgroundColor: Colors.green,
                duration: const Duration(seconds: 2),
              ),
            );
          },
        ),
      );
    } catch (e) {
      debugPrint('❌ Error showing agent interest bottom sheet: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Kuch galat ho gaya. Please try again.',
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

  // Agent member se match percentage calculate karne ka function
  double _calculateAgentMemberMatchPercentage(Map<String, dynamic> member) {
    // Dummy calculation - aage backend se proper calculation karenge
    double matchScore = 0.0;

    // Age compatibility
    final memberAge = int.tryParse(member['age']?.toString() ?? '0') ?? 0;
    final profileAge =
        int.tryParse(widget.userData['age']?.toString() ?? '0') ?? 0;
    if ((memberAge - profileAge).abs() <= 5) matchScore += 20;

    // Location compatibility
    if (member['city'] == widget.userData['city']) matchScore += 15;

    // Marital status compatibility
    if (member['martial_status'] == widget.userData['martial_status'])
      matchScore += 15;

    // Education level compatibility
    if (member['Education'] == widget.userData['Education']) matchScore += 10;

    // Random factor for demo
    matchScore += (DateTime.now().millisecond % 20);

    return matchScore.clamp(0.0, 100.0);
  }

  // Member se interest bhejne ka function
  Future<void> _sendInterestFromMember(Map<String, dynamic> member) async {
    try {
      setState(() {
        isSendingInterest = true;
      });

      // Member ke behalf se interest bhejo
      final response = await ProfileService.sendInterest(
        fromUserId: member['id']?.toString() ?? '',
        toUserId: widget.userData['id']?.toString() ?? '',
        toUserName: widget.userData['name'] ?? '',
      );

      Navigator.pop(context); // Bottom sheet close karo

      if (response['already_sent'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '${member['name']} has already sent interest!',
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
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Interest sent successfully from ${member['name']}!',
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
    } catch (e) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Kuch galat ho gaya. Please try again.',
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
    } finally {
      if (mounted) {
        setState(() {
          isSendingInterest = false;
        });
      }
    }
  }

  // Send Interest function (ab pehle check karega, aur backend ke message ko UI pe dikhayega)
  Future<void> _sendInterest() async {
    // Agar agent mode hai toh bottom sheet show karo
    if (_isAgentMode()) {
      await _showAgentInterestBottomSheet();
      return;
    }

    setState(() {
      isSendingInterest = true;
    });
    try {
      // Pehle backend se interest bhejne ki koshish karo aur pura response lo
      final response = await ProfileService.sendInterest(
        fromUserId: widget.currentUserId,
        toUserId: widget.userData['id']?.toString() ??
            widget.userData['userId']?.toString() ??
            '',
        toUserName: widget.userData['name'] ?? '',
      );

      // Ab backend ke response ke hisaab se UI pe message dikhao
      if (response['already_sent'] == true) {
        // Agar already interest bheja hai toh orange snackbar
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
      } else {
        // Success ya error ka message
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
              backgroundColor:
                  response['error'] != null ? Colors.red : Colors.green,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        }
      }
    } catch (e) {
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
    } finally {
      if (mounted) {
        setState(() {
          isSendingInterest = false;
        });
      }
    }
  }

  @override
  void initState() {
    super.initState();
    // Force refresh user data from backend to get latest privacy settings
    _refreshUserDataFromBackend();
    // Load gallery photos for carousel
    _loadProfileGalleryPhotos();
    // Add scroll listener for gallery collapse
    _scrollController.addListener(_handleScroll);
  }

  @override
  void dispose() {
    _pageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // Handle scroll for gallery collapse effect
  void _handleScroll() {
    if (!mounted) return;

    double scrollOffset = _scrollController.offset;

    // Calculate collapse threshold (scroll start hote hi collapse shuru kare)
    // Ab user jese hi scroll karna start kare, gallery collapse hona start ho jayegi
    double collapseStartOffset = 0.0; // Immediately start collapse on scroll
    double collapseEndOffset = 200.0; // Completely collapsed at 200px scroll

    if (scrollOffset < collapseStartOffset) {
      // No collapse - full height
      if (_galleryHeight != _maxGalleryHeight) {
        setState(() {
          _galleryHeight = _maxGalleryHeight;
          _isGalleryCollapsed = false;
        });
      }
    } else if (scrollOffset >= collapseEndOffset) {
      // Completely collapsed
      if (_galleryHeight != _minGalleryHeight) {
        setState(() {
          _galleryHeight = _minGalleryHeight;
          _isGalleryCollapsed = true;
        });
      }
    } else {
      // Gradual collapse between start and end offset
      double collapseProgress = (scrollOffset - collapseStartOffset) /
          (collapseEndOffset - collapseStartOffset);
      collapseProgress = collapseProgress.clamp(0.0, 1.0);

      double newHeight = _maxGalleryHeight * (1.0 - collapseProgress);

      if ((_galleryHeight - newHeight).abs() > 5.0) {
        // Avoid too frequent updates
        setState(() {
          _galleryHeight = newHeight;
          _isGalleryCollapsed = collapseProgress > 0.8;
        });
      }
    }
  }

  // Load gallery photos for the profile user
  Future<void> _loadProfileGalleryPhotos() async {
    try {
      setState(() {
        _isLoadingGallery = true;
      });

      final profileUserId = widget.userData['id']?.toString() ?? '';
      if (profileUserId.isEmpty) {
        debugPrint('❌ Profile user ID not found for gallery loading');
        return;
      }

      debugPrint('📸 Loading gallery photos for profile user: $profileUserId');
      debugPrint(
          '📸 Full API URL: https://mehrammatchbackend-production.up.railway.app/api/user/add_photo/?user_id=$profileUserId');

      final response = await http.get(
        Uri.parse(
            'https://mehrammatchbackend-production.up.railway.app/api/user/add_photo/?user_id=$profileUserId'),
        headers: {'Content-Type': 'application/json'},
      );

      debugPrint('📸 Gallery API Response Status: ${response.statusCode}');
      debugPrint('📸 Gallery API Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final List<dynamic> photosData = jsonDecode(response.body);
        debugPrint('📸 Raw photos data: $photosData');

        setState(() {
          _galleryPhotos = photosData.map((photo) {
            String photoUrl = photo['upload_photo'] ?? '';
            if (photoUrl.isNotEmpty && !photoUrl.startsWith('http')) {
              photoUrl = 'https://mehrammatchbackend-production.up.railway.app$photoUrl';
            }

            debugPrint('📸 Processing photo: ${photo['id']} -> $photoUrl');

            return {
              'id': photo['id'],
              'upload_photo': photoUrl,
              'uploaded_at': photo['uploaded_at'],
            };
          }).toList();

          _currentPhotoIndex = 0; // Reset to first photo
        });

        debugPrint(
            '📸 ✅ Loaded ${_galleryPhotos.length} gallery photos for profile');
        debugPrint('📸 Gallery photos list: $_galleryPhotos');
      } else {
        debugPrint('❌ Gallery API failed with status: ${response.statusCode}');
        debugPrint('❌ Error response: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Error loading profile gallery photos: $e');
    } finally {
      setState(() {
        _isLoadingGallery = false;
      });
    }
  }

  // Refresh user data from backend to get latest privacy settings
  Future<void> _refreshUserDataFromBackend() async {
    try {
      String userId = widget.userData['id']?.toString() ?? '';

      if (userId.isNotEmpty) {
        debugPrint('🔄 Force refreshing user data for privacy check...');

        // Fetch fresh user data from backend
        final freshUserData =
            await ProfileService.fetchUserProfile(userId: userId);

        if (freshUserData != null && mounted) {
          // Update widget data with fresh data from backend
          widget.userData.clear();
          widget.userData.addAll(freshUserData);

          debugPrint('✅ User data refreshed successfully');
          debugPrint(
              '🔒 Fresh privacy setting: ${freshUserData['photo_upload_privacy_option']}');
        }
      }
    } catch (e) {
      debugPrint('❌ Error refreshing user data: $e');
    } finally {
      // Simulate loading time for UI smoothness
      Future.delayed(const Duration(milliseconds: 1500), () {
        if (mounted) {
          setState(() {
            isLoadingProfile = false;
          });
        }
      });
    }
  }

  // Instagram-style shimmer for profile image section
  Widget _buildProfileImageShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        height: 270,
        decoration: BoxDecoration(
          color: Colors.grey.shade300,
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(28),
            bottomRight: Radius.circular(28),
          ),
        ),
        child: Stack(
          children: [
            // Main shimmer background
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
              ),
            ),
            // Name shimmer at bottom
            Positioned(
              left: 20,
              right: 20,
              bottom: 60,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 24,
                    width: 200,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    height: 16,
                    width: 120,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        height: 24,
                        width: 60,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        height: 24,
                        width: 80,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        height: 24,
                        width: 100,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(12),
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

  // Instagram-style shimmer for introduction card with text lines
  Widget _buildIntroCardShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 22, 16, 0),
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200, width: 1.2),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header shimmer
            Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  height: 20,
                  width: 120,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Instagram-style paragraph text shimmer - multiple lines of different lengths
            Container(
              height: 14,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(7),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              height: 14,
              width: 280,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(7),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              height: 14,
              width: 320,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(7),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              height: 14,
              width: 200,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(7),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              height: 14,
              width: 150,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(7),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Instagram-style shimmer for content cards
  Widget _buildContentCardShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200, width: 1.2),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header shimmer
            Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                const SizedBox(width: 10),
                Container(
                  height: 20,
                  width: 150,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Content lines shimmer - Instagram style varied text lengths
            ...List.generate(
                5,
                (index) => Padding(
                      padding: const EdgeInsets.only(bottom: 14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Field name shimmer - varied widths like Instagram
                                Container(
                                  height: 14,
                                  width: _getShimmerWidth(index, 'label'),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade300,
                                    borderRadius: BorderRadius.circular(7),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                // Field value shimmer - different lengths like Instagram text
                                Container(
                                  height: 12,
                                  width: _getShimmerWidth(index, 'value'),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade300,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    )),
          ],
        ),
      ),
    );
  }

  // Shimmer for bottom action bar
  Widget _buildBottomActionShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        margin: EdgeInsets.fromLTRB(16, 0, 16, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                flex: 2,
                child: Container(
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Instagram-style varied shimmer widths for realistic text loading
  double _getShimmerWidth(int index, String type) {
    // Different widths for each line to mimic real text lengths like Instagram
    if (type == 'label') {
      // Field labels - shorter widths
      switch (index % 5) {
        case 0:
          return 80.0; // "Full Name"
        case 1:
          return 65.0; // "Gender"
        case 2:
          return 95.0; // "Date of Birth"
        case 3:
          return 110.0; // "Marital Status"
        case 4:
          return 75.0; // "Location"
        default:
          return 85.0;
      }
    } else {
      // Field values - varied widths like Instagram text
      switch (index % 5) {
        case 0:
          return 180.0; // Long name
        case 1:
          return 60.0; // Short value like "Male"
        case 2:
          return 140.0; // Medium length like date
        case 3:
          return 90.0; // Medium like "Single"
        case 4:
          return 220.0; // Long location text
        default:
          return 160.0;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    print('onbehalf: ${widget.userData['onbehalf']}');
    // Gender-based placeholder logic (now handled in privacy-aware photo display)
    bool showHijab = (widget.userData['gender']?.toLowerCase() == 'female' &&
        (widget.userData['upload_photo'] == null ||
            widget.userData['upload_photo'].isEmpty));
    bool showMuslimMan = (widget.userData['gender']?.toLowerCase() == 'male' &&
        (widget.userData['upload_photo'] == null ||
            widget.userData['upload_photo'].isEmpty));
    String fullName = widget.userData['name'] ??
        '${widget.userData['first_name'] ?? ''} ${widget.userData['last_name'] ?? ''}'
            .trim();
    String memberId =
        widget.userData['member_id'] ?? widget.userData['id']?.toString() ?? '';
    String age = widget.userData['age']?.toString() ?? '--';
    String marital =
        widget.userData['martial_status'] ?? widget.userData['marital'] ?? '';
    String city = widget.userData['city'] ?? '';
    String intro = widget.userData['about_you'] ?? '';
    String dob = widget.userData['dob'] ?? 'xx/xx/xxxx';
    // Profile Created For field ke liye sab possible backend keys check karo (profile_for, onbehalf, onbehalf_of)
    String profileFor = widget.userData['profile_for'] ??
        widget.userData['onbehalf'] ??
        widget.userData['onbehalf_of'] ??
        'N/A'; // Agar kuch bhi na mile toh N/A dikhao
    String profession = widget.userData['profession'] ?? '';
    String education = widget.userData['Education'] ?? '';
    String photo = widget.userData['upload_photo'] ?? '';
    String photoPrivacy = widget.userData['photo_upload_privacy_option']
            ?.toString()
            .toLowerCase() ??
        'all member'; // Step5 se aane wala privacy option

    // Pink Camera Icon dikhane ka logic - ONLY for "approval required" privacy
    bool showRequestPhoto = false;
    if (photoPrivacy == 'only to users whom i approve') {
      // Sirf "only to users whom i approve" privacy setting ke liye camera icon show karo
      showRequestPhoto = true;
      debugPrint(
          '📸 Pink camera icon should be visible for approval required privacy');
    } else {
      debugPrint('📸 Pink camera icon hidden - privacy: $photoPrivacy');
    }

    // Show shimmer loading if profile is still loading
    if (isLoadingProfile) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Container(
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
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Profile image shimmer
                  _buildProfileImageShimmer(),
                  // Introduction card shimmer with text lines
                  _buildIntroCardShimmer(),
                  // Content cards shimmer with field data
                  _buildContentCardShimmer(),
                  _buildContentCardShimmer(),
                  _buildContentCardShimmer(),
                  _buildContentCardShimmer(),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ),
        bottomNavigationBar: _buildBottomActionShimmer(),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
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
          child: Column(
            children: [
              // Top Back Button Bar
              Container(
                width: double.infinity,
                height: 60,
                color: Colors.white,
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: Icon(Icons.arrow_back,
                          color: Colors.black87, size: 24),
                      tooltip: 'Back',
                    ),
                    Expanded(
                      child: Text(
                        fullName,
                        style: GoogleFonts.ibmPlexSansArabic(
                          color: Colors.black87,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    SizedBox(width: 16),
                  ],
                ),
              ),

              // Gallery ko bhi ab scrollable bana diya hai (upar se scroll hoga!)
              // Yahan Column ke andar Expanded mein CustomScrollView hai
              Expanded(
                child: CustomScrollView(
                  controller: _scrollController, // Scroll controller add kiya
                  slivers: [
                    // Gallery section ko SliverToBoxAdapter mein wrap kiya
                    SliverToBoxAdapter(
                      child: Container(
                        width: double.infinity,
                        height:
                            _galleryHeight, // Dynamic height based on scroll
                        decoration: BoxDecoration(
                          color: Colors.white,
                          boxShadow: _galleryHeight > 50
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 10,
                                    offset: Offset(0, 4),
                                  ),
                                ]
                              : [], // Remove shadow when collapsed
                        ),
                        child: _galleryHeight > 50
                            ? Stack(
                                children: [
                                  // Photo Gallery
                                  Positioned.fill(
                                    child: _buildPrivacyAwarePhoto(
                                        photo, photoPrivacy),
                                  ),
                                  // Pink camera request button (if needed)
                                  if (showRequestPhoto)
                                    Positioned(
                                      top: 16,
                                      right: 16,
                                      child: Material(
                                        color: Colors.transparent,
                                        child: InkWell(
                                          onTap: _handlePhotoRequest,
                                          borderRadius:
                                              BorderRadius.circular(25),
                                          child: Container(
                                            width: 50,
                                            height: 50,
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors.pink.shade400,
                                                  Colors.pink.shade600
                                                ],
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                              ),
                                              shape: BoxShape.circle,
                                              border: Border.all(
                                                  color: Colors.white,
                                                  width: 2),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.pink
                                                      .withOpacity(0.3),
                                                  blurRadius: 12,
                                                  offset: Offset(0, 4),
                                                ),
                                              ],
                                            ),
                                            child: Center(
                                              child: Icon(
                                                  Icons.camera_enhance_rounded,
                                                  color: Colors.white,
                                                  size: 24),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              )
                            : Container(), // Empty container when collapsed
                      ),
                    ),

                    // Baaki content SliverList mein
                    SliverList(
                      delegate: SliverChildListDelegate([
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.blue.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.blue.withOpacity(0.08),
                                blurRadius: 20,
                                offset: Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Name with verified badge
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        fullName,
                                        style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 26,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ),
                                    // Agent verified badge - agar user agent verified hai toh different badge dikhao
                                    if (widget.userData['agent_verified'] ==
                                        true) ...[
                                      Container(
                                        padding: EdgeInsets.symmetric(
                                          horizontal: 10,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              Colors.green.shade400,
                                              Colors.green.shade600
                                            ],
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.verified_user,
                                                color: Colors.white, size: 16),
                                            SizedBox(width: 4),
                                            Text(
                                              'Agent Verified',
                                              style:
                                                  GoogleFonts.ibmPlexSansArabic(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ] else ...[
                                      // Regular verified badge - agar agent verified nahi hai
                                      Container(
                                        padding: EdgeInsets.symmetric(
                                          horizontal: 10,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              Colors.blue.shade400,
                                              Colors.blue.shade600
                                            ],
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.verified,
                                                color: Colors.white, size: 16),
                                            SizedBox(width: 4),
                                            Text(
                                              'Verified',
                                              style:
                                                  GoogleFonts.ibmPlexSansArabic(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ],
                                ),

                                SizedBox(height: 8),

                                // Member ID
                                Row(
                                  children: [
                                    Icon(Icons.badge_outlined,
                                        color: Colors.grey.shade500, size: 16),
                                    SizedBox(width: 6),
                                    Text(
                                      'ID: $memberId',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                        fontSize: 13,
                                        color: Colors.grey.shade600,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),

                                SizedBox(height: 16),

                                // Tags Row - Age, Marital Status, Location
                                Wrap(
                                  spacing: 8,
                                  runSpacing: 8,
                                  children: [
                                    // Age Tag
                                    _buildInfoTag(
                                      icon: Icons.cake_outlined,
                                      label: '$age years',
                                      color: Colors.purple,
                                    ),

                                    // Marital Status Tag
                                    _buildInfoTag(
                                      icon: Icons.favorite_outline,
                                      label: marital.isNotEmpty
                                          ? marital
                                          : 'Not specified',
                                      color: Colors.pink,
                                    ),

                                    // Location Tag
                                    _buildInfoTag(
                                      icon: Icons.location_on_outlined,
                                      label: city.isNotEmpty
                                          ? city
                                          : 'Location not specified',
                                      color: Colors.green,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Introduction Card
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 22, 16, 0),
                          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.pink.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.pink.withOpacity(0.07),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      color: Colors.pink.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(Icons.info_outline,
                                        color: Colors.pink.shade400, size: 20),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Introduction',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold)),
                                ],
                              ),
                              SizedBox(height: 12),
                              Text(
                                intro.isNotEmpty
                                    ? intro
                                    : 'No introduction provided.',
                                style: GoogleFonts.ibmPlexSansArabic(
                                    fontSize: 15,
                                    color: Colors.grey.shade800,
                                    height: 1.6),
                                maxLines: 6,
                                overflow: TextOverflow.fade,
                              ),
                            ],
                          ),
                        ),

                        // Basic Details Card (ab sirf step1.dart ke fields, modern icon + heading + value style)
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.pink.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.pink.withOpacity(0.07),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      color: Colors.pink.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(Icons.person_outline,
                                        color: Colors.pink.shade400, size: 20),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Basic Details',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold)),
                                  Spacer(),
                                  // Edit icon sirf apni profile dekhte waqt dikhana (dusre users ki profile pe nahi)
                                  if (widget.userData['id'].toString() ==
                                      widget.currentUserId) ...[
                                    IconButton(
                                      icon: Icon(Icons.edit,
                                          color: Colors.pink, size: 20),
                                      tooltip: 'Edit Basic Details',
                                      onPressed: () {
                                        // Step1 form screen par edit mode mein redirect karo
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                Step1FormScreen(
                                                    isEditMode: true),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ],
                              ),
                              SizedBox(height: 14),
                              // Full Name
                              _buildSocialField(Icons.person, 'Full Name',
                                  widget.userData['name'] ?? '--'),
                              SizedBox(height: 12),
                              // Gender
                              _buildSocialField(
                                  Icons.male,
                                  'Gender',
                                  widget.userData['gender']
                                          ?.toString()
                                          .capitalize() ??
                                      '--'),
                              SizedBox(height: 12),
                              // Profile created for
                              _buildSocialField(
                                Icons.people,
                                'Profile Created For',
                                // Sirf 'onbehalf' key use karo kyunki backend/DB mein wahi hai
                                widget.userData['onbehalf'] ?? '--',
                              ),
                              SizedBox(height: 12),
                              // Date of Birth
                              _buildSocialField(
                                  Icons.cake, 'Date of Birth', dob),
                              SizedBox(height: 12),
                              // Marital Status
                              _buildSocialField(
                                  Icons.favorite, 'Marital Status', marital),

                              SizedBox(height: 12),
                              // Height
                              _buildSocialField(Icons.height, 'Height',
                                  widget.userData['height'] ?? '--'),
                              SizedBox(height: 12),
                              // Location (Country, State, City)
                              _buildSocialField(Icons.location_on, 'Location',
                                  _formatLocation(widget.userData)),
                            ],
                          ),
                        ),

                        // Agent Information Card - sirf agent verified users ke liye
                        if (widget.userData['agent_verified'] == true &&
                            widget.userData['agent_info'] != null) ...[
                          Container(
                            margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                            padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                  color: Colors.green.shade50, width: 1.2),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.green.withOpacity(0.07),
                                  blurRadius: 18,
                                  offset: Offset(0, 6),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: EdgeInsets.all(7),
                                      decoration: BoxDecoration(
                                        color: Colors.green.shade50,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Icon(Icons.verified_user,
                                          color: Colors.green.shade400,
                                          size: 20),
                                    ),
                                    SizedBox(width: 10),
                                    Text('Agent Information',
                                        style: GoogleFonts.ibmPlexSansArabic(
                                            fontSize: 17,
                                            fontWeight: FontWeight.bold)),
                                  ],
                                ),
                                SizedBox(height: 14),
                                // Agent Name
                                _buildSocialField(
                                    Icons.person,
                                    'Verified By Agent',
                                    widget.userData['agent_info']['name'] ??
                                        '--'),
                                SizedBox(height: 12),
                                // Agent Contact
                                if (widget.userData['agent_info']
                                            ['contact_number'] !=
                                        null &&
                                    widget.userData['agent_info']
                                            ['contact_number']
                                        .toString()
                                        .isNotEmpty)
                                  _buildSocialField(
                                      Icons.phone,
                                      'Agent Contact',
                                      widget.userData['agent_info']
                                              ['contact_number'] ??
                                          '--'),
                                SizedBox(height: 12),
                                // Agent City
                                if (widget.userData['agent_info']['city'] !=
                                        null &&
                                    widget.userData['agent_info']['city']
                                        .toString()
                                        .isNotEmpty)
                                  _buildSocialField(
                                      Icons.location_city,
                                      'Agent Location',
                                      widget.userData['agent_info']['city'] ??
                                          '--'),
                              ],
                            ),
                          ),
                        ],

                        // Religious Details Card (step2.dart style, naya section)
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.orange.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.orange.withOpacity(0.07),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      color: Colors.orange.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(Icons.mosque,
                                        color: Colors.orange.shade400,
                                        size: 20),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Religious Details',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold)),
                                  Spacer(),
                                  // Edit icon sirf apni profile dekhte waqt dikhana (dusre users ki profile pe nahi)
                                  if (widget.userData['id'].toString() ==
                                      widget.currentUserId) ...[
                                    IconButton(
                                      icon: Icon(Icons.edit,
                                          color: Colors.orange, size: 20),
                                      tooltip: 'Edit Religious Details',
                                      onPressed: () {
                                        // Step2 edit mode mein open karo
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) => Step2(
                                              name: widget.userData['name'],
                                              gender: widget.userData['gender'],
                                              isEditMode: true,
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ],
                              ),
                              SizedBox(height: 14),
                              // Sect/School Information
                              _buildSocialField(
                                  Icons.school,
                                  'Sect/School Information',
                                  widget.userData['sect_school_info'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              // Believe in Dargah/Fatiha/Niyah
                              _buildSocialField(
                                  Icons.auto_stories,
                                  'Believe in Dargah/Fatiha/Niyah',
                                  widget.userData[
                                          'believe_in_dargah_fatiha_niyah'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              // Islamic Practicing Level
                              _buildSocialField(
                                  Icons.psychology,
                                  'Islamic Practicing Level',
                                  widget.userData['islamic_practicing_level'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              // Hijab/Niqab Preference (Female specific)
                              if (widget.userData['gender']?.toLowerCase() ==
                                  'female')
                                _buildSocialField(
                                    Icons.face,
                                    'Hijab/Niqab Preference',
                                    widget.userData['hijab_niqab_prefer'] ??
                                        'Not Provided'),
                              if (widget.userData['gender']?.toLowerCase() ==
                                  'female')
                                SizedBox(height: 12),
                            ],
                          ),
                        ),

                        // Family Details Card (step3.dart style, modern icon + heading + value format)
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.green.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.green.withOpacity(0.07),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      color: Colors.green.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(Icons.family_restroom,
                                        color: Colors.green.shade400, size: 20),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Family Details',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold)),
                                  Spacer(),
                                  // Edit icon sirf apni profile dekhte waqt dikhana (dusre users ki profile pe nahi)
                                  if (widget.userData['id'].toString() ==
                                      widget.currentUserId) ...[
                                    IconButton(
                                      icon: Icon(Icons.edit,
                                          color: Colors.green, size: 20),
                                      tooltip: 'Edit Family Details',
                                      onPressed: () {
                                        // Step3 edit mode mein open karo
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) => Step3(
                                              name: widget.userData['name'],
                                              gender: widget.userData['gender'],
                                              isEditMode: true,
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ],
                              ),
                              SizedBox(height: 14),
                              // Father Information
                              _buildSocialField(
                                  Icons.person,
                                  'Father Name',
                                  widget.userData['father_name'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.help_outline,
                                  'Is Father Step Father?',
                                  widget.userData['step_father'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.favorite,
                                  'Is Father Alive?',
                                  widget.userData['father_alive'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.work,
                                  'Father Occupation',
                                  widget.userData['father_occupation'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.description,
                                  'Father Job Description',
                                  widget.userData['father_job_business'] ??
                                      'Not Provided'),
                              SizedBox(height: 14),

                              // Mother Information
                              _buildSocialField(
                                  Icons.person,
                                  'Mother Name',
                                  widget.userData['mother_name'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.help_outline,
                                  'Is Mother Step Mother?',
                                  widget.userData['step_mother'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.favorite,
                                  'Is Mother Alive?',
                                  widget.userData['mother_alive'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.work,
                                  'Mother Occupation',
                                  widget.userData['mother_occupation'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.description,
                                  'Mother Job Description',
                                  widget.userData['mother_job_business'] ??
                                      'Not Provided'),
                              SizedBox(height: 16),

                              // Siblings Information
                              _buildSocialField(
                                  Icons.people,
                                  'Number of Siblings',
                                  widget.userData['number_of_siblings']
                                          ?.toString() ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              // Number of Brothers (conditional)
                              if (_isGreaterThanZero(
                                  widget.userData['number_of_siblings']))
                                _buildSocialField(
                                    Icons.male,
                                    'Number of Brothers',
                                    widget.userData['number_of_brothers']
                                            ?.toString() ??
                                        'Not Provided'),
                              if (_isGreaterThanZero(
                                  widget.userData['number_of_siblings']))
                                SizedBox(height: 12),
                              // Number of Sisters (conditional)
                              if (_isGreaterThanZero(
                                  widget.userData['number_of_siblings']))
                                _buildSocialField(
                                    Icons.female,
                                    'Number of Sisters',
                                    widget.userData['number_of_sisters']
                                            ?.toString() ??
                                        'Not Provided'),
                              SizedBox(height: 14),

                              // Children Information Section (conditional)
                              if (_shouldShowChildrenInfo() &&
                                  _isGreaterThanZero(widget
                                      .userData['number_of_children'])) ...[
                                _buildSocialField(
                                    Icons.child_care,
                                    'Number of Children',
                                    widget.userData['number_of_children']
                                            ?.toString() ??
                                        'Not Provided'),
                                SizedBox(height: 12),
                                // Number of Sons (conditional)
                                if (_isGreaterThanZero(widget
                                        .userData['number_of_children']) &&
                                    widget.userData['number_of_sons'] != null)
                                  _buildSocialField(
                                      Icons.boy,
                                      'Number of Sons',
                                      widget.userData['number_of_sons']
                                              ?.toString() ??
                                          'Not Provided'),
                                if (_isGreaterThanZero(widget
                                        .userData['number_of_children']) &&
                                    widget.userData['number_of_sons'] != null)
                                  SizedBox(height: 12),
                                // Number of Daughters (conditional)
                                if (_isGreaterThanZero(widget
                                        .userData['number_of_children']) &&
                                    widget.userData['number_of_daughters'] !=
                                        null)
                                  _buildSocialField(
                                      Icons.girl,
                                      'Number of Daughters',
                                      widget.userData['number_of_daughters']
                                              ?.toString() ??
                                          'Not Provided'),
                                SizedBox(height: 14),
                              ],

                              // Family Background
                              _buildSocialField(
                                  Icons.home,
                                  'Family Type',
                                  widget.userData['family_type'] ??
                                      'Not Provided'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.psychology,
                                  'Family Practicing Level',
                                  widget.userData['family_practicing_level'] ??
                                      'Not Provided'),
                              SizedBox(height: 14),

                              // Wali Details Section (Female specific)
                              if (widget.userData['gender']?.toLowerCase() ==
                                  'female') ...[
                                _buildSocialField(
                                    Icons.person_add,
                                    'Wali Name',
                                    widget.userData['wali_name'] ??
                                        'Not Provided'),
                                SizedBox(height: 12),
                                _buildSocialField(
                                    Icons.family_restroom,
                                    'Wali Blood Relation',
                                    widget.userData['wali_blood_relation'] ??
                                        'Not Provided'),
                                SizedBox(height: 12),
                                _buildSocialField(
                                    Icons.phone,
                                    'Wali Contact Number',
                                    widget.userData['wali_contact_number'] ??
                                        'Not Provided'),
                              ],
                            ],
                          ),
                        ),

                        // Partner Preference Card (naya section)
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.pink.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.pink.withOpacity(0.07),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      color: Colors.pink.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(Icons.favorite,
                                        color: Colors.pink.shade400, size: 20),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Partner Preference',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold)),
                                  Spacer(),
                                  // Edit icon sirf apni profile dekhte waqt dikhana (dusre users ki profile pe nahi)
                                  if (widget.userData['id'].toString() ==
                                      widget.currentUserId) ...[
                                    IconButton(
                                      icon: Icon(Icons.edit,
                                          color: Colors.pink, size: 20),
                                      tooltip: 'Edit Partner Preference',
                                      onPressed: () {
                                        // Step4 edit mode mein open karo
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) => Step4(
                                              name: widget.userData['name'],
                                              gender: widget.userData['gender'],
                                              isEditMode: true,
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ],
                              ),
                              SizedBox(height: 14),
                              _buildSocialField(
                                  Icons.person,
                                  'Preferred Surname',
                                  widget.userData['preferred_surname']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.mosque,
                                  'Preferred Sect',
                                  widget.userData['preferred_sect']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.auto_stories,
                                  'Spiritual Options',
                                  _formatSpiritualOptions(widget.userData)),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.psychology,
                                  'Desired Practicing Level',
                                  widget.userData['desired_practicing_level']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.family_restroom,
                                  'Preferred Family Type',
                                  widget.userData['preferred_family_type']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.school,
                                  'Education Level',
                                  widget.userData['education_level']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.work,
                                  'Profession/Occupation',
                                  widget.userData['profession_occupation']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.location_on,
                                  'Preferred Location',
                                  _formatPreferredLocation(widget.userData)),
                              SizedBox(height: 12),
                              _buildSocialField(
                                  Icons.attach_money,
                                  'Preferred Income Range',
                                  widget.userData['preferred_income_range']
                                          ?.toString() ??
                                      '---'),
                            ],
                          ),
                        ),

                        // Social Details Card (step3_1.dart style, naya section, ab heading + value + icon format, hamesha show karo)
                        Container(
                          margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.purple.shade50, width: 1.2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.purple.withOpacity(0.07),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: EdgeInsets.all(7),
                                    decoration: BoxDecoration(
                                      color: Colors.purple.shade50,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(Icons.people_alt,
                                        color: Colors.purple.shade400,
                                        size: 20),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Social Details',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                          fontSize: 17,
                                          fontWeight: FontWeight.bold)),
                                  Spacer(),
                                  // Edit icon sirf apni profile dekhte waqt dikhana (dusre users ki profile pe nahi)
                                  if (widget.userData['id'].toString() ==
                                      widget.currentUserId) ...[
                                    IconButton(
                                      icon: Icon(Icons.edit,
                                          color: Colors.purple, size: 20),
                                      tooltip: 'Edit Social Details',
                                      onPressed: () {
                                        // Step3_1 edit mode mein open karo
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                Step3_1FormScreen(
                                                    isEditMode: true),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ],
                              ),
                              SizedBox(height: 14),
                              // Education
                              _buildSocialField(
                                  Icons.school,
                                  'Education',
                                  widget.userData['Education']?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              // Profession
                              _buildSocialField(
                                  Icons.work,
                                  'Profession',
                                  widget.userData['profession']?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              // Job Description
                              _buildSocialField(
                                  Icons.description,
                                  'Job Description',
                                  widget.userData['describe_job_business']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              // Annual Income
                              _buildSocialField(
                                  Icons.attach_money,
                                  'Annual Income',
                                  widget.userData['income']?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              // Disability
                              _buildSocialField(
                                  Icons.accessibility,
                                  'Disability',
                                  (widget.userData['disability']?.toString() ??
                                          '---')
                                      .toUpperCase()),
                              SizedBox(height: 12),
                              // Disability Type
                              _buildSocialField(
                                  Icons.info_outline,
                                  'Disability Type',
                                  widget.userData['type_of_disability']
                                          ?.toString() ??
                                      '---'),
                              SizedBox(height: 12),
                              // Native Place
                              _buildSocialField(
                                  Icons.location_city,
                                  'Native Place',
                                  _formatNativePlace(widget.userData)),
                            ],
                          ),
                        ),

                        // Recommendations Section (homepage style, blur only cards if not filled)
                        Builder(
                          builder: (context) {
                            bool hasPartnerPref =
                                (widget.userData['partner_education'] != null &&
                                        widget.userData['partner_education']
                                            .toString()
                                            .trim()
                                            .isNotEmpty) ||
                                    (widget.userData['partner_profession'] !=
                                            null &&
                                        widget.userData['partner_profession']
                                            .toString()
                                            .trim()
                                            .isNotEmpty) ||
                                    (widget.userData['partner_family_type'] !=
                                            null &&
                                        widget.userData['partner_family_type']
                                            .toString()
                                            .trim()
                                            .isNotEmpty) ||
                                    (widget.userData['partner_sect'] != null &&
                                        widget.userData['partner_sect']
                                            .toString()
                                            .trim()
                                            .isNotEmpty);

                            // Dummy recommended profiles (homepage style)
                            List<Map<String, String?>> recommendedProfiles = [
                              {
                                'name': 'Rehana Khan',
                                'marital': 'Divorced',
                                'age': '24',
                                'photo': '',
                                'match': '70.0',
                                'gender': 'female',
                                'location': 'Chandrapur, Maharashtra',
                                'profession': 'NA',
                                'userId': '1001',
                              },
                              {
                                'name': 'Ayesha Siddiqui',
                                'marital': 'Single',
                                'age': '25',
                                'photo': '',
                                'match': '68.0',
                                'gender': 'female',
                                'location': 'Mumbai',
                                'profession': 'Doctor',
                                'userId': '1002',
                              },
                            ];

                            return Container(
                              margin: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                              padding: const EdgeInsets.fromLTRB(0, 0, 0, 0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Heading + subtitle (homepage style)
                                  Row(
                                    children: [
                                      Container(
                                        width: 4,
                                        height: 24,
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              Colors.purple,
                                              Colors.purple.shade100
                                            ],
                                            begin: Alignment.topCenter,
                                            end: Alignment.bottomCenter,
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(2),
                                        ),
                                      ),
                                      SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          'Recommendations',
                                          style: GoogleFonts.ibmPlexSansArabic(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 22,
                                            color: Colors.black87,
                                          ),
                                        ),
                                      ),
                                      Icon(Icons.trending_up,
                                          color: Colors.purple, size: 24),
                                    ],
                                  ),
                                  SizedBox(height: 6),
                                  Padding(
                                    padding: const EdgeInsets.only(left: 16),
                                    child: Text(
                                      'Best matches based on your preferences female members according to Islamic values.',
                                      style: GoogleFonts.ibmPlexSansArabic(
                                        color: Colors.grey.shade600,
                                        fontSize: 14,
                                        height: 1.3,
                                      ),
                                    ),
                                  ),
                                  SizedBox(height: 18),
                                  // Horizontal scrollable profile cards (homepage style)
                                  Stack(
                                    children: [
                                      SizedBox(
                                        height: 380,
                                        child: ListView.separated(
                                          scrollDirection: Axis.horizontal,
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 4),
                                          itemCount: recommendedProfiles.length,
                                          separatorBuilder: (context, index) =>
                                              const SizedBox(width: 16),
                                          itemBuilder: (context, index) {
                                            final user =
                                                recommendedProfiles[index];
                                            // Homepage style card builder (copy/paste from homepage.dart _buildModernProfileCard)
                                            return Container(
                                              width: 200,
                                              height: 370,
                                              decoration: BoxDecoration(
                                                gradient: LinearGradient(
                                                  begin: Alignment.topLeft,
                                                  end: Alignment.bottomRight,
                                                  colors: [
                                                    Colors.white
                                                        .withOpacity(0.9),
                                                    Colors.white
                                                        .withOpacity(0.8),
                                                  ],
                                                ),
                                                borderRadius:
                                                    BorderRadius.circular(25),
                                                border: Border.all(
                                                    color: Colors.purple
                                                        .withOpacity(0.1)),
                                                boxShadow: [
                                                  BoxShadow(
                                                    color: Colors.purple
                                                        .withOpacity(0.1),
                                                    blurRadius: 20,
                                                    offset: const Offset(0, 8),
                                                  ),
                                                  BoxShadow(
                                                    color: Colors.white
                                                        .withOpacity(0.5),
                                                    blurRadius: 20,
                                                    offset:
                                                        const Offset(-5, -5),
                                                  ),
                                                ],
                                              ),
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  // Photo Section
                                                  Stack(
                                                    children: [
                                                      Container(
                                                        width: double.infinity,
                                                        height: 200,
                                                        decoration:
                                                            BoxDecoration(
                                                          borderRadius:
                                                              const BorderRadius
                                                                  .vertical(
                                                            top:
                                                                Radius.circular(
                                                                    25),
                                                          ),
                                                          gradient:
                                                              LinearGradient(
                                                            colors: [
                                                              Colors.grey
                                                                  .shade100,
                                                              Colors
                                                                  .grey.shade50,
                                                            ],
                                                          ),
                                                        ),
                                                        child: ClipRRect(
                                                          borderRadius:
                                                              const BorderRadius
                                                                  .vertical(
                                                            top:
                                                                Radius.circular(
                                                                    25),
                                                          ),
                                                          child: Image.asset(
                                                            'assets/images/hijab-woman.png',
                                                            fit: BoxFit.cover,
                                                            width:
                                                                double.infinity,
                                                            height:
                                                                double.infinity,
                                                          ),
                                                        ),
                                                      ),
                                                      // Match Badge
                                                      if (user['match'] !=
                                                              null &&
                                                          user['match']!
                                                              .isNotEmpty)
                                                        Positioned(
                                                          top: 12,
                                                          right: 12,
                                                          child: Container(
                                                            padding:
                                                                const EdgeInsets
                                                                    .symmetric(
                                                              horizontal: 10,
                                                              vertical: 6,
                                                            ),
                                                            decoration:
                                                                BoxDecoration(
                                                              gradient:
                                                                  LinearGradient(
                                                                colors: [
                                                                  Colors.green
                                                                      .shade400,
                                                                  Colors.green
                                                                      .shade600,
                                                                ],
                                                              ),
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          15),
                                                              boxShadow: [
                                                                BoxShadow(
                                                                  color: Colors
                                                                      .green
                                                                      .withOpacity(
                                                                          0.3),
                                                                  blurRadius:
                                                                      10,
                                                                  offset:
                                                                      const Offset(
                                                                          0, 3),
                                                                ),
                                                              ],
                                                            ),
                                                            child: Row(
                                                              mainAxisSize:
                                                                  MainAxisSize
                                                                      .min,
                                                              children: [
                                                                Icon(
                                                                  Icons
                                                                      .favorite,
                                                                  color: Colors
                                                                      .white,
                                                                  size: 12,
                                                                ),
                                                                const SizedBox(
                                                                    width: 4),
                                                                Text(
                                                                  user[
                                                                      'match']!,
                                                                  style: GoogleFonts
                                                                      .ibmPlexSansArabic(
                                                                    color: Colors
                                                                        .white,
                                                                    fontSize:
                                                                        12,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .bold,
                                                                  ),
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                        ),
                                                      // Marital badge
                                                      Positioned(
                                                        top: 12,
                                                        left: 12,
                                                        child: Container(
                                                          padding:
                                                              const EdgeInsets
                                                                  .symmetric(
                                                            horizontal: 8,
                                                            vertical: 4,
                                                          ),
                                                          decoration:
                                                              BoxDecoration(
                                                            color: Colors.white
                                                                .withOpacity(
                                                                    0.9),
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        12),
                                                            border: Border.all(
                                                                color: Colors
                                                                    .purple
                                                                    .withOpacity(
                                                                        0.3)),
                                                          ),
                                                          child: Text(
                                                            user['marital'] ??
                                                                '',
                                                            style: GoogleFonts
                                                                .ibmPlexSansArabic(
                                                              color:
                                                                  Colors.purple,
                                                              fontSize: 10,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .w600,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  // Profile Info
                                                  Expanded(
                                                    child: Padding(
                                                      padding: const EdgeInsets
                                                          .fromLTRB(
                                                          14, 14, 14, 12),
                                                      child: Column(
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .start,
                                                        mainAxisSize:
                                                            MainAxisSize.min,
                                                        children: [
                                                          Row(
                                                            children: [
                                                              Expanded(
                                                                child: Text(
                                                                  user['name'] ??
                                                                      '',
                                                                  style: GoogleFonts
                                                                      .ibmPlexSansArabic(
                                                                    fontSize:
                                                                        17,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .bold,
                                                                    color: Colors
                                                                        .black87,
                                                                  ),
                                                                  maxLines: 1,
                                                                  overflow:
                                                                      TextOverflow
                                                                          .ellipsis,
                                                                ),
                                                              ),
                                                              Container(
                                                                padding:
                                                                    const EdgeInsets
                                                                        .symmetric(
                                                                  horizontal: 7,
                                                                  vertical: 2,
                                                                ),
                                                                decoration:
                                                                    BoxDecoration(
                                                                  color: Colors
                                                                      .purple
                                                                      .withOpacity(
                                                                          0.1),
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              8),
                                                                ),
                                                                child: Text(
                                                                  '${user['age'] ?? '--'} yrs',
                                                                  style: GoogleFonts
                                                                      .ibmPlexSansArabic(
                                                                    fontSize:
                                                                        11,
                                                                    color: Colors
                                                                        .purple,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .w600,
                                                                  ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          const SizedBox(
                                                              height: 6),
                                                          if (user['profession'] !=
                                                                  null &&
                                                              user['profession']!
                                                                  .isNotEmpty)
                                                            Container(
                                                              padding:
                                                                  const EdgeInsets
                                                                      .symmetric(
                                                                horizontal: 7,
                                                                vertical: 3,
                                                              ),
                                                              decoration:
                                                                  BoxDecoration(
                                                                color: Colors
                                                                    .grey
                                                                    .shade100,
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            8),
                                                              ),
                                                              child: Text(
                                                                user[
                                                                    'profession']!,
                                                                style: GoogleFonts
                                                                    .ibmPlexSansArabic(
                                                                  fontSize: 11,
                                                                  color: Colors
                                                                      .grey
                                                                      .shade700,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w500,
                                                                ),
                                                                maxLines: 1,
                                                                overflow:
                                                                    TextOverflow
                                                                        .ellipsis,
                                                              ),
                                                            ),
                                                          const SizedBox(
                                                              height: 6),
                                                          if (user['location'] !=
                                                                  null &&
                                                              user['location']!
                                                                  .isNotEmpty)
                                                            Row(
                                                              children: [
                                                                Icon(
                                                                  Icons
                                                                      .location_on_outlined,
                                                                  size: 13,
                                                                  color: Colors
                                                                      .grey
                                                                      .shade600,
                                                                ),
                                                                const SizedBox(
                                                                    width: 3),
                                                                Expanded(
                                                                  child: Text(
                                                                    user[
                                                                        'location']!,
                                                                    style: GoogleFonts
                                                                        .ibmPlexSansArabic(
                                                                      fontSize:
                                                                          12,
                                                                      color: Colors
                                                                          .grey
                                                                          .shade600,
                                                                    ),
                                                                    maxLines: 1,
                                                                    overflow:
                                                                        TextOverflow
                                                                            .ellipsis,
                                                                  ),
                                                                ),
                                                              ],
                                                            ),
                                                          const Spacer(),
                                                          // Send Interest Button (homepage style)
                                                          GestureDetector(
                                                            onTap: isSendingInterest
                                                                ? null
                                                                : _sendInterest,
                                                            child: Container(
                                                              width: double
                                                                  .infinity,
                                                              padding:
                                                                  const EdgeInsets
                                                                      .symmetric(
                                                                      vertical:
                                                                          10),
                                                              decoration:
                                                                  BoxDecoration(
                                                                gradient:
                                                                    LinearGradient(
                                                                  colors: [
                                                                    Colors
                                                                        .purple,
                                                                    Colors
                                                                        .purple
                                                                        .shade300
                                                                  ],
                                                                ),
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            12),
                                                                boxShadow: [
                                                                  BoxShadow(
                                                                    color: Colors
                                                                        .purple
                                                                        .withOpacity(
                                                                            0.13),
                                                                    blurRadius:
                                                                        8,
                                                                    offset:
                                                                        const Offset(
                                                                            0,
                                                                            3),
                                                                  ),
                                                                ],
                                                              ),
                                                              child:
                                                                  isSendingInterest
                                                                      ? Center(
                                                                          child:
                                                                              SizedBox(
                                                                            width:
                                                                                18,
                                                                            height:
                                                                                18,
                                                                            child:
                                                                                CircularProgressIndicator(
                                                                              color: Colors.white,
                                                                              strokeWidth: 2.2,
                                                                            ),
                                                                          ),
                                                                        )
                                                                      : Row(
                                                                          mainAxisAlignment:
                                                                              MainAxisAlignment.center,
                                                                          children: [
                                                                            Icon(
                                                                              Icons.favorite_border,
                                                                              size: 16,
                                                                              color: Colors.white,
                                                                            ),
                                                                            const SizedBox(width: 6),
                                                                            Text(
                                                                              'Send Interest',
                                                                              style: GoogleFonts.ibmPlexSansArabic(
                                                                                fontSize: 13,
                                                                                color: Colors.white,
                                                                                fontWeight: FontWeight.w600,
                                                                              ),
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
                                            );
                                          },
                                        ),
                                      ),
                                      // Blur overlay + message only on cards area if not filled
                                      if (!hasPartnerPref)
                                        Positioned.fill(
                                          child: ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                            child: BackdropFilter(
                                              filter: ImageFilter.blur(
                                                  sigmaX: 7, sigmaY: 7),
                                              child: Container(
                                                color: Colors.white
                                                    .withOpacity(0.7),
                                                alignment: Alignment.center,
                                                child: Padding(
                                                  padding: const EdgeInsets
                                                      .symmetric(
                                                      horizontal: 18.0),
                                                  child: Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Icon(Icons.info_outline,
                                                          color: Colors.purple,
                                                          size: 26),
                                                      const SizedBox(width: 12),
                                                      Flexible(
                                                        child: Text(
                                                          'Complete your Partner Preference to see more recommendations.',
                                                          style: GoogleFonts
                                                              .ibmPlexSansArabic(
                                                            fontSize: 16,
                                                            color:
                                                                Colors.purple,
                                                            fontWeight:
                                                                FontWeight.w600,
                                                          ),
                                                          textAlign:
                                                              TextAlign.center,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 18),
                                  // See All Profiles Button (homepage style)
                                  Center(
                                    child: GestureDetector(
                                      onTap: () {},
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 24, vertical: 12),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              Colors.purple.withOpacity(0.1),
                                              Colors.purple.withOpacity(0.05),
                                            ],
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(20),
                                          border: Border.all(
                                              color: Colors.purple
                                                  .withOpacity(0.3)),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              'SEE ALL PROFILES',
                                              style:
                                                  GoogleFonts.ibmPlexSansArabic(
                                                color: Colors.purple,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14,
                                                letterSpacing: 0.5,
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Icon(
                                              Icons.arrow_forward_ios,
                                              color: Colors.purple,
                                              size: 14,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),

                        SizedBox(height: 40),
                      ]),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      // Bottom Action Bar
      bottomNavigationBar: (widget.userData['id'].toString() !=
              widget.currentUserId)
          ? Container(
              margin: EdgeInsets.fromLTRB(16, 0, 16, 16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.8),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 18,
                    offset: Offset(0, 6),
                  ),
                  BoxShadow(
                    color: Colors.white.withOpacity(0.7),
                    blurRadius: 1,
                    offset: Offset(0, 1),
                  ),
                ],
                border:
                    Border.all(color: Colors.white.withOpacity(0.5), width: 1),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Send Interest Button - Different for Agent and User
                        if (_isAgentMode()) ...[
                          // Agent mode: Full width interest button
                          Expanded(
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 4),
                              child: ElevatedButton(
                                onPressed:
                                    isSendingInterest ? null : _sendInterest,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.pink.shade600,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                  elevation: 0,
                                ),
                                child: isSendingInterest
                                    ? SizedBox(
                                        width: 18,
                                        height: 18,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2.2,
                                        ),
                                      )
                                    : Text(
                                        'Send Interest from Members',
                                        style: GoogleFonts.ibmPlexSansArabic(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                      ),
                              ),
                            ),
                          ),
                        ] else ...[
                          // User mode: Three buttons (Interest, Chat, Call)
                          Expanded(
                            flex: 2,
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 4),
                              child: ElevatedButton(
                                onPressed:
                                    isSendingInterest ? null : _sendInterest,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.pink.shade600,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                  elevation: 0,
                                ),
                                child: isSendingInterest
                                    ? SizedBox(
                                        width: 18,
                                        height: 18,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2.2,
                                        ),
                                      )
                                    : Text(
                                        'Send Interest',
                                        style: GoogleFonts.ibmPlexSansArabic(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                      ),
                              ),
                            ),
                          ),
                          // Chat button
                          Expanded(
                            flex: 2,
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 4),
                              child: OutlinedButton.icon(
                                onPressed: () => _handleChatNow(),
                                icon: Icon(Icons.message_outlined,
                                    color: Colors.pink.shade600, size: 20),
                                label: Text(
                                  'Chat',
                                  style: GoogleFonts.ibmPlexSansArabic(
                                    color: Colors.pink.shade600,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                                style: OutlinedButton.styleFrom(
                                  side: BorderSide(
                                      color: Colors.pink.shade100, width: 1.5),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  backgroundColor: Colors.white,
                                  padding: EdgeInsets.symmetric(
                                      vertical: 12, horizontal: 10),
                                ),
                              ),
                            ),
                          ),
                          // Call button
                          _buildIconActionButton(
                            color: Colors.green.shade600,
                            icon: Icons.call_outlined,
                            onTap: () {},
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            )
          : null,
    );
  }

  // Helper for info chips (age, marital, city)
  Widget _buildInfoChip(IconData icon, String value, Color textColor) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.18),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: textColor.withOpacity(0.85), size: 15),
          SizedBox(width: 5),
          Text(value,
              style: GoogleFonts.ibmPlexSansArabic(
                  fontSize: 13, color: textColor, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  // Helper for modern info tags (profile card style)
  Widget _buildInfoTag(
      {required IconData icon, required String label, required Color color}) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 16),
          SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  // Helper for detail rows
  Widget _buildDetailRow(IconData icon, String label, String value) {
    // Check if value is null, empty, or contains null-like values
    String displayValue = _formatFieldValue(value);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, color: Colors.grey.shade400, size: 18),
          SizedBox(width: 8),
          Text(label + ': ',
              style: GoogleFonts.ibmPlexSansArabic(
                  fontWeight: FontWeight.w600, fontSize: 15)),
          Expanded(
            child: Text(displayValue,
                style: GoogleFonts.ibmPlexSansArabic(
                    fontSize: 15, color: Colors.grey.shade800)),
          ),
        ],
      ),
    );
  }

  // Helper for formatting native place
  String _formatNativePlace(Map<String, dynamic> data) {
    final country = _formatFieldValue(data['native_country']?.toString());
    final state = _formatFieldValue(data['native_state']?.toString());
    final city = _formatFieldValue(data['native_city']?.toString());

    // If all fields are "---", return "---"
    if (country == '---' && state == '---' && city == '---') {
      return '---';
    }

    // Filter out "---" values and join
    List<String> validParts =
        [country, state, city].where((e) => e != '---').toList();
    return validParts.isEmpty ? '---' : validParts.join(', ');
  }

  // Helper for formatting location (country, state, city)
  String _formatLocation(Map<String, dynamic> data) {
    final country = _formatFieldValue(data['country']?.toString());
    final state = _formatFieldValue(data['state']?.toString());
    final city = _formatFieldValue(data['city']?.toString());

    // If all fields are "---", return "---"
    if (country == '---' && state == '---' && city == '---') {
      return '---';
    }

    // Filter out "---" values and join
    List<String> validParts =
        [city, state, country].where((e) => e != '---').toList();
    return validParts.isEmpty ? '---' : validParts.join(', ');
  }

  // Helper for formatting family location
  String _formatFamilyLocation(Map<String, dynamic> data) {
    final country = _formatFieldValue(data['family_country']?.toString());
    final state = _formatFieldValue(data['family_state']?.toString());
    final city = _formatFieldValue(data['family_city']?.toString());

    // If all fields are "---", return "---"
    if (country == '---' && state == '---' && city == '---') {
      return '---';
    }

    // Filter out "---" values and join
    List<String> validParts =
        [city, state, country].where((e) => e != '---').toList();
    return validParts.isEmpty ? '---' : validParts.join(', ');
  }

  // Helper for formatting spiritual options (step4.dart se)
  String _formatSpiritualOptions(Map<String, dynamic> data) {
    try {
      // Check if spiritual_options is a list or string
      var spiritualOptions = data['selected_spiritual_options'];

      if (spiritualOptions == null) {
        return '---';
      }

      if (spiritualOptions is List) {
        // If it's a list, join with commas
        List<String> options =
            spiritualOptions.map((e) => e.toString()).toList();
        return options.isEmpty ? '---' : options.join(', ');
      } else if (spiritualOptions is String) {
        // If it's a string, return as is
        return spiritualOptions.trim().isEmpty ? '---' : spiritualOptions;
      }

      return '---';
    } catch (e) {
      return '---';
    }
  }

  // Helper for formatting preferred location (step4.dart se)
  String _formatPreferredLocation(Map<String, dynamic> data) {
    final country = _formatFieldValue(data['preferred_country']?.toString());
    final state = _formatFieldValue(data['preferred_state']?.toString());
    final city = _formatFieldValue(data['preferred_city']?.toString());

    // If all fields are "---", return "---"
    if (country == '---' && state == '---' && city == '---') {
      return '---';
    }

    // Filter out "---" values and join
    List<String> validParts =
        [city, state, country].where((e) => e != '---').toList();
    return validParts.isEmpty ? '---' : validParts.join(', ');
  }

  // Helper to check if children info should be shown (for divorced/widowed)
  bool _shouldShowChildrenInfo() {
    final maritalStatus =
        widget.userData['martial_status']?.toString().toLowerCase() ?? '';
    return maritalStatus == 'divorced' ||
        maritalStatus == 'khula' ||
        maritalStatus == 'widowed';
  }

  // Helper to safely convert string to int and check if greater than 0
  bool _isGreaterThanZero(String? value) {
    if (value == null) return false;
    final intValue = int.tryParse(value.toString());
    return intValue != null && intValue > 0;
  }

  // Helper for valid social field
  bool _isValidSocialField(String? value) {
    if (value == null) return false;
    final v = value.trim().toLowerCase();
    return v.isNotEmpty &&
        v != 'na' &&
        v != 'not provided' &&
        v != 'not applicable' &&
        v != 'not applicable/not studied/never studied' &&
        v != 'never studied';
  }

  // Helper for social field with icon, heading, value
  Widget _buildSocialField(IconData icon, String heading, String value) {
    // Check if value is null, empty, or contains null-like values
    String displayValue = _formatFieldValue(value);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 2, right: 10),
          child: Icon(icon, color: Colors.purple.shade300, size: 20),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(heading,
                  style: GoogleFonts.ibmPlexSansArabic(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Colors.black87)),
              SizedBox(height: 2),
              Text(displayValue,
                  style: GoogleFonts.ibmPlexSansArabic(
                      fontSize: 15, color: Colors.grey.shade800)),
            ],
          ),
        ),
      ],
    );
  }

  // Helper to format field values - NULL, empty, or invalid values ko "---" mein convert kare
  String _formatFieldValue(String? value) {
    if (value == null || value.isEmpty) {
      return '---';
    }

    // Trim whitespace and check for null-like strings
    String trimmedValue = value.trim().toLowerCase();

    // Check for various null/empty representations
    if (trimmedValue == 'null' ||
        trimmedValue == 'none' ||
        trimmedValue == 'na' ||
        trimmedValue == 'n/a' ||
        trimmedValue == 'not applicable' ||
        trimmedValue == 'not available' ||
        trimmedValue == 'undefined' ||
        trimmedValue == '') {
      return '---';
    }

    // Return original value if it's valid
    return value.trim();
  }

  // Helper for section headers in Family Details
  Widget _buildSectionHeader(String title, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.green.shade600, size: 18),
          const SizedBox(width: 8),
          Text(
            title,
            style: GoogleFonts.ibmPlexSansArabic(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.green.shade700,
            ),
          ),
        ],
      ),
    );
  }

  // Modern icon-only action button builder (bottom bar)
  Widget _buildIconActionButton({
    required Color color,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20), // chota border radius
        child: Container(
          width: 40, // chota button
          height: 40,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.13),
                blurRadius: 7,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Icon(icon, color: Colors.white, size: 22), // chota icon
          ),
        ),
      ),
    );
  }

  // Calculate match percentage between current user and profile user
  Future<double> _calculateMatchPercentage() async {
    try {
      debugPrint('🎯 Calculating match percentage...');

      // Get current user data from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final currentUserId = prefs.getInt('user_id');

      if (currentUserId == null) {
        debugPrint('❌ Current user ID not found');
        return 0.0;
      }

      // Get current user profile
      final currentUserResponse = await http.get(
        Uri.parse('https://mehrammatchbackend-production.up.railway.app/api/user/$currentUserId/'),
        headers: {'Content-Type': 'application/json'},
      );

      if (currentUserResponse.statusCode != 200) {
        debugPrint('❌ Failed to get current user data');
        return 0.0;
      }

      final currentUserData = jsonDecode(currentUserResponse.body);
      final profileUserData = widget.userData;

      debugPrint(
          '👤 Current User: ${currentUserData['first_name']} ${currentUserData['last_name']}');
      debugPrint(
          '👥 Profile User: ${profileUserData['first_name']} ${profileUserData['last_name']}');

      // Backend compatibility logic - weighted scoring
      Map<String, double> weights = {
        "age": 0.2,
        "location": 0.3,
        "education": 0.2,
        "profession": 0.3
      };

      double totalScore = 0.0;

      // Age compatibility
      final currentAge = currentUserData['age'];
      final profileAge = profileUserData['age'];

      if (currentAge != null && profileAge != null) {
        try {
          int currentAgeInt = int.parse(currentAge.toString());
          int profileAgeInt = int.parse(profileAge.toString());
          int ageDiff = (currentAgeInt - profileAgeInt).abs();

          if (ageDiff <= 2) {
            totalScore += weights["age"]! * 100;
            debugPrint('✅ Age match: Perfect (${ageDiff}y diff)');
          } else {
            double ageScore =
                weights["age"]! * 100 * (1 - (ageDiff / 10)).clamp(0.0, 1.0);
            totalScore += ageScore;
            debugPrint(
                '⚡ Age match: Partial (${ageDiff}y diff, score: ${ageScore.toStringAsFixed(1)})');
          }
        } catch (e) {
          debugPrint('❌ Age parsing error: $e');
        }
      }

      // Location compatibility (City match)
      final currentCity = currentUserData['city']?.toString()?.toLowerCase();
      final profileCity = profileUserData['city']?.toString()?.toLowerCase();

      if (currentCity != null &&
          profileCity != null &&
          currentCity == profileCity) {
        totalScore += weights["location"]! * 100;
        debugPrint('✅ Location match: Same city ($currentCity)');
      } else {
        debugPrint(
            '❌ Location match: Different cities ($currentCity vs $profileCity)');
      }

      // Education compatibility
      final currentEducation =
          currentUserData['Education']?.toString()?.toLowerCase();
      final profileEducation =
          profileUserData['Education']?.toString()?.toLowerCase();

      if (currentEducation != null &&
          profileEducation != null &&
          currentEducation == profileEducation) {
        totalScore += weights["education"]! * 100;
        debugPrint('✅ Education match: Same level ($currentEducation)');
      } else {
        debugPrint(
            '❌ Education match: Different levels ($currentEducation vs $profileEducation)');
      }

      // Profession compatibility
      final currentProfession =
          currentUserData['profession']?.toString()?.toLowerCase();
      final profileProfession =
          profileUserData['profession']?.toString()?.toLowerCase();

      if (currentProfession != null &&
          profileProfession != null &&
          currentProfession == profileProfession) {
        totalScore += weights["profession"]! * 100;
        debugPrint('✅ Profession match: Same field ($currentProfession)');
      } else {
        debugPrint(
            '❌ Profession match: Different fields ($currentProfession vs $profileProfession)');
      }

      double finalScore = totalScore.clamp(0.0, 100.0);
      debugPrint('🎯 Final Match Score: ${finalScore.toStringAsFixed(1)}%');

      return finalScore;
    } catch (e) {
      debugPrint('❌ Match calculation error: $e');
      return 0.0;
    }
  }

  // Privacy-aware photo display logic - SIMPLIFIED VERSION (PHOTO ONLY!)
  Widget _buildPrivacyAwarePhoto(String photo, String photoPrivacy) {
    debugPrint('🔒 Photo Privacy: $photoPrivacy');
    debugPrint('📷 Photo URL: $photo');
    debugPrint('🖼️ Gallery Photos Count: ${_galleryPhotos.length}');

    // If gallery photos available, show ONLY current photo (no controls)
    if (_galleryPhotos.isNotEmpty) {
      debugPrint('✅ CREATING EXACT PRODUCT GALLERY STYLE FROM IMAGE');
      return Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.white,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Main product photo - full screen
            Center(
              child: GestureDetector(
                onTap: () {
                  debugPrint('📸 Product photo tapped - Full screen view');
                  _openFullScreenGallery(_currentPhotoIndex);
                },
                onHorizontalDragEnd: (DragEndDetails details) {
                  if (details.primaryVelocity! > 0 && _currentPhotoIndex > 0) {
                    debugPrint('👈 SWIPED RIGHT - Previous product! 🔥');
                    setState(() {
                      _currentPhotoIndex = _currentPhotoIndex - 1;
                    });
                  } else if (details.primaryVelocity! < 0 &&
                      _currentPhotoIndex < _galleryPhotos.length - 1) {
                    debugPrint('👉 SWIPED LEFT - Next product! 🔥');
                    setState(() {
                      _currentPhotoIndex = _currentPhotoIndex + 1;
                    });
                  }
                },
                child: Container(
                  width: double.infinity,
                  height: double.infinity,
                  child: Image.network(
                    _galleryPhotos[_currentPhotoIndex]['upload_photo'] ?? '',
                    fit: BoxFit.contain,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) {
                        debugPrint('✅ Product photo loaded successfully');
                        return child;
                      }
                      return Center(
                        child: Container(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircularProgressIndicator(
                                strokeWidth: 3,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.grey.shade600),
                              ),
                              SizedBox(height: 20),
                              Text(
                                'Loading product photo...',
                                style: GoogleFonts.inter(
                                  color: Colors.grey.shade600,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      debugPrint('❌ Product photo failed to load: $error');
                      return _buildSimpleGenderPlaceholder();
                    },
                  ),
                ),
              ),
            ),

            // Left Navigation Arrow - Exact style from image
            if (_galleryPhotos.length > 1 && _currentPhotoIndex > 0)
              Positioned(
                left: 24,
                top: 0,
                bottom: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: () {
                      debugPrint('⬅️ LEFT ARROW TAPPED - Previous product! 🔥');
                      setState(() {
                        _currentPhotoIndex = _currentPhotoIndex - 1;
                      });
                      debugPrint(
                          '📸 Switched to product ${_currentPhotoIndex + 1}');
                    },
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.95),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 12,
                            offset: Offset(0, 6),
                          ),
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 6,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: Colors.black87,
                          size: 22,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

            // Right Navigation Arrow - Exact style from image
            if (_galleryPhotos.length > 1 &&
                _currentPhotoIndex < _galleryPhotos.length - 1)
              Positioned(
                right: 24,
                top: 0,
                bottom: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: () {
                      debugPrint('➡️ RIGHT ARROW TAPPED - Next product! 🔥');
                      setState(() {
                        _currentPhotoIndex = _currentPhotoIndex + 1;
                      });
                      debugPrint(
                          '📸 Switched to product ${_currentPhotoIndex + 1}');
                    },
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.95),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 12,
                            offset: Offset(0, 6),
                          ),
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 6,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Icon(
                          Icons.arrow_forward_ios_rounded,
                          color: Colors.black87,
                          size: 22,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

            // Product counter indicator - Clean design
            if (_galleryPhotos.length > 1)
              Positioned(
                bottom: 24,
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.75),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.3),
                          blurRadius: 8,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Text(
                      '${_currentPhotoIndex + 1} / ${_galleryPhotos.length}',
                      style: GoogleFonts.inter(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
              ),

            // Zoom indicator (top-right)
            Positioned(
              top: 24,
              right: 24,
              child: Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.zoom_in_outlined,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ],
        ),
      );
    }

    // Fallback: Single photo or placeholder
    if (photo.isNotEmpty) {
      debugPrint('✅ Showing single photo - FULL RATIO');
      return GestureDetector(
        onTap: () {
          debugPrint('📸 Single photo tapped');
        },
        child: Container(
          width: double.infinity,
          height: double.infinity,
          color: Colors.white,
          child: Center(
            child: Image.network(
              photo,
              fit: BoxFit.contain, // FULL PHOTO - NO CROP!
              width: double.infinity,
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) {
                  debugPrint('✅ Single photo loaded at original ratio');
                  return child;
                }
                return Center(
                  child: CircularProgressIndicator(),
                );
              },
              errorBuilder: (context, error, stackTrace) {
                debugPrint('❌ Single photo load failed: $error');
                return _buildSimpleGenderPlaceholder();
              },
            ),
          ),
        ),
      );
    }

    // Final fallback: Gender placeholder
    debugPrint('✅ Showing gender placeholder');
    return _buildSimpleGenderPlaceholder();
  }

  // Simple gender placeholder
  Widget _buildSimpleGenderPlaceholder() {
    String gender = widget.userData['gender']?.toString().toLowerCase() ?? '';

    if (gender == 'female') {
      return Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.white,
        child: Center(
          child: Image.asset(
            'assets/images/hijab-woman.png',
            fit: BoxFit.contain, // FULL PLACEHOLDER - NO CROP!
            width: double.infinity,
          ),
        ),
      );
    } else if (gender == 'male') {
      return Container(
        width: double.infinity,
        height: double.infinity,
        color: Colors.white,
        child: Center(
          child: Image.asset(
            'assets/images/muslim-man.png',
            fit: BoxFit.contain, // FULL PLACEHOLDER - NO CROP!
            width: double.infinity,
          ),
        ),
      );
    } else {
      return Container(
        color: Colors.grey.shade200,
        child: Center(
          child: Icon(Icons.person, size: 80, color: Colors.grey.shade400),
        ),
      );
    }
  }

  // Simple photo request handler
  void _handlePhotoRequest() {
    debugPrint('📸 Photo request - Simple success message');

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Photo request sent successfully!',
          style: GoogleFonts.ibmPlexSansArabic(color: Colors.white),
        ),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  // Simple full screen gallery (basic version)
  void _openFullScreenGallery(int initialIndex) {
    debugPrint('📱 Opening simple full screen view');

    showDialog(
      context: context,
      builder: (context) => Dialog.fullscreen(
        child: Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.black,
            iconTheme: IconThemeData(color: Colors.white),
            title: Text(
              'Photo ${initialIndex + 1} of ${_galleryPhotos.length}',
              style: GoogleFonts.inter(color: Colors.white),
            ),
          ),
          body: Center(
            child: InteractiveViewer(
              child: Image.network(
                _galleryPhotos[initialIndex]['upload_photo'] ?? '',
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Simple Amazon/Flipkart style photo gallery - GUARANTEED TO WORK! 🛒
  Widget _buildPhotoCarousel() {
    debugPrint(
        '🛒 Building Amazon-style gallery with ${_galleryPhotos.length} photos');

    if (_galleryPhotos.isEmpty) {
      debugPrint('❌ No photos in gallery');
      return Container(
          color: Colors.grey.shade200, child: Icon(Icons.image, size: 100));
    }

    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.white,
      child: Column(
        children: [
          // Main Photo Display (Amazon style)
          Expanded(
            flex: 8,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: GestureDetector(
                onTap: () {
                  debugPrint('📸 Photo tapped - Opening full screen');
                  _openFullScreenGallery(_currentPhotoIndex);
                },
                child: Image.network(
                  _galleryPhotos[_currentPhotoIndex]['upload_photo'] ?? '',
                  fit: BoxFit.contain,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Center(
                      child: CircularProgressIndicator(
                        value: loadingProgress.expectedTotalBytes != null
                            ? loadingProgress.cumulativeBytesLoaded /
                                loadingProgress.expectedTotalBytes!
                            : null,
                      ),
                    );
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.broken_image,
                              size: 64, color: Colors.grey),
                          Text('Photo not available',
                              style: GoogleFonts.inter(color: Colors.grey)),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          ),

          // Navigation Controls (Amazon style)
          Container(
            height: 80,
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              border: Border(top: BorderSide(color: Colors.grey.shade200)),
            ),
            child: Row(
              children: [
                // Previous Button
                if (_galleryPhotos.length > 1)
                  ElevatedButton.icon(
                    onPressed: _currentPhotoIndex > 0
                        ? () {
                            debugPrint(
                                '⬅️ Previous button clicked - SIMPLE WORKING VERSION');
                            setState(() {
                              _currentPhotoIndex = _currentPhotoIndex - 1;
                            });
                            debugPrint(
                                '📸 Moved to photo ${_currentPhotoIndex + 1}');
                          }
                        : null,
                    icon: Icon(Icons.arrow_back_ios, size: 16),
                    label: Text('Previous'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _currentPhotoIndex > 0
                          ? Colors.blue
                          : Colors.grey.shade300,
                      foregroundColor: Colors.white,
                      elevation: 2,
                      padding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),

                // Photo Counter (Amazon style)
                Expanded(
                  child: Center(
                    child: Container(
                      padding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Text(
                        '${_currentPhotoIndex + 1} of ${_galleryPhotos.length}',
                        style: GoogleFonts.inter(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                  ),
                ),

                // Next Button
                if (_galleryPhotos.length > 1)
                  ElevatedButton.icon(
                    onPressed: _currentPhotoIndex < _galleryPhotos.length - 1
                        ? () {
                            debugPrint(
                                '➡️ Next button clicked - SIMPLE WORKING VERSION');
                            setState(() {
                              _currentPhotoIndex = _currentPhotoIndex + 1;
                            });
                            debugPrint(
                                '📸 Moved to photo ${_currentPhotoIndex + 1}');
                          }
                        : null,
                    icon: Icon(Icons.arrow_forward_ios, size: 16),
                    label: Text('Next'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          _currentPhotoIndex < _galleryPhotos.length - 1
                              ? Colors.blue
                              : Colors.grey.shade300,
                      foregroundColor: Colors.white,
                      elevation: 2,
                      padding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
              ],
            ),
          ),

          // Thumbnail Strip (Flipkart style)
          if (_galleryPhotos.length > 1)
            Container(
              height: 80,
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Colors.grey.shade200)),
              ),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _galleryPhotos.length,
                itemBuilder: (context, index) {
                  bool isSelected = index == _currentPhotoIndex;
                  return GestureDetector(
                    onTap: () {
                      debugPrint(
                          '📸 Thumbnail $index clicked - SIMPLE VERSION');
                      setState(() {
                        _currentPhotoIndex = index;
                      });
                    },
                    child: Container(
                      width: 64,
                      height: 64,
                      margin: EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color:
                              isSelected ? Colors.blue : Colors.grey.shade300,
                          width: isSelected ? 3 : 1,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.network(
                          _galleryPhotos[index]['upload_photo'] ?? '',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: Colors.grey.shade200,
                              child: Icon(Icons.image, color: Colors.grey),
                            );
                          },
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

// Custom painter for subtle background pattern
class _SubtlePatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.indigo.withOpacity(0.03)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    // Create subtle diagonal pattern
    for (double i = -size.height; i < size.width + size.height; i += 30) {
      canvas.drawLine(
        Offset(i, 0),
        Offset(i + size.height, size.height),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Custom painter for floating particles background
class _FloatingParticlesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Color(0xFF667EEA).withOpacity(0.08)
      ..style = PaintingStyle.fill;

    // Create floating circular particles
    final particles = [
      Offset(size.width * 0.1, size.height * 0.2),
      Offset(size.width * 0.8, size.height * 0.15),
      Offset(size.width * 0.2, size.height * 0.7),
      Offset(size.width * 0.9, size.height * 0.8),
      Offset(size.width * 0.05, size.height * 0.9),
      Offset(size.width * 0.7, size.height * 0.4),
    ];

    final radii = [8.0, 12.0, 6.0, 10.0, 4.0, 14.0];

    for (int i = 0; i < particles.length; i++) {
      canvas.drawCircle(particles[i], radii[i], paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// String extension for capitalize
extension StringCasingExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1).toLowerCase();
  }
}

// Null-safe capitalize extension
extension NullSafeStringExtension on String? {
  String capitalizeSafe() {
    if (this == null || this!.isEmpty) return 'N/A';
    return this![0].toUpperCase() + this!.substring(1).toLowerCase();
  }
}

// Full Screen Gallery Widget - Amazon/Flipkart style
class FullScreenGallery extends StatefulWidget {
  final List<Map<String, dynamic>> photos;
  final int initialIndex;

  const FullScreenGallery({
    Key? key,
    required this.photos,
    required this.initialIndex,
  }) : super(key: key);

  @override
  State<FullScreenGallery> createState() => _FullScreenGalleryState();
}

class _FullScreenGalleryState extends State<FullScreenGallery> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Full screen photo viewer
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            itemCount: widget.photos.length,
            itemBuilder: (context, index) {
              return InteractiveViewer(
                panEnabled: true,
                scaleEnabled: true,
                minScale: 0.5,
                maxScale: 4.0,
                child: Center(
                  child: Image.network(
                    widget.photos[index]['upload_photo'] ?? '',
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.black,
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.broken_image,
                                  size: 80, color: Colors.white54),
                              SizedBox(height: 16),
                              Text(
                                'Failed to load photo ${index + 1}',
                                style: GoogleFonts.inter(
                                  color: Colors.white70,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;

                      return Container(
                        color: Colors.black,
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircularProgressIndicator(
                                value: loadingProgress.expectedTotalBytes !=
                                        null
                                    ? loadingProgress.cumulativeBytesLoaded /
                                        loadingProgress.expectedTotalBytes!
                                    : null,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                                strokeWidth: 3,
                              ),
                              SizedBox(height: 20),
                              Text(
                                'Loading photo ${index + 1}...',
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              );
            },
          ),

          // Top overlay with close button and counter
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 100,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.7),
                    Colors.transparent,
                  ],
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Close button
                      GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.5),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),

                      // Photo counter
                      Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.6),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          '${_currentIndex + 1} of ${widget.photos.length}',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Bottom navigation arrows (if more than 1 photo)
          if (widget.photos.length > 1) ...[
            // Left arrow
            if (_currentIndex > 0)
              Positioned(
                left: 20,
                top: 0,
                bottom: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: () {
                      _pageController.previousPage(
                        duration: Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        shape: BoxShape.circle,
                        border:
                            Border.all(color: Colors.white.withOpacity(0.3)),
                      ),
                      child: Icon(
                        Icons.chevron_left,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                  ),
                ),
              ),

            // Right arrow
            if (_currentIndex < widget.photos.length - 1)
              Positioned(
                right: 20,
                top: 0,
                bottom: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: () {
                      _pageController.nextPage(
                        duration: Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        shape: BoxShape.circle,
                        border:
                            Border.all(color: Colors.white.withOpacity(0.3)),
                      ),
                      child: Icon(
                        Icons.chevron_right,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                  ),
                ),
              ),
          ],

          // Bottom dot indicators (if more than 1 photo)
          if (widget.photos.length > 1)
            Positioned(
              bottom: 40,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(widget.photos.length, (index) {
                  return Container(
                    margin: EdgeInsets.symmetric(horizontal: 4),
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: index == _currentIndex
                          ? Colors.white
                          : Colors.white.withOpacity(0.4),
                    ),
                  );
                }),
              ),
            ),
        ],
      ),
    );
  }
}

// Full Screen Placeholder Widget for asset images
class FullScreenPlaceholder extends StatelessWidget {
  final String assetPath;

  const FullScreenPlaceholder({Key? key, required this.assetPath})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          Center(
            child: InteractiveViewer(
              panEnabled: true,
              scaleEnabled: true,
              minScale: 0.5,
              maxScale: 4.0,
              child: Image.asset(assetPath, fit: BoxFit.contain),
            ),
          ),
          Positioned(
            top: 40,
            left: 16,
            child: SafeArea(
              child: GestureDetector(
                onTap: () => Navigator.of(context).pop(),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.5),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.close, color: Colors.white, size: 24),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Agent Members Bottom Sheet - Shows agent's members with match compatibility and interest functionality
class _AgentMembersBottomSheet extends StatefulWidget {
  final List<Map<String, dynamic>> members;
  final Map<String, dynamic> targetUser;
  final Function(int) onInterestSent;

  const _AgentMembersBottomSheet({
    required this.members,
    required this.targetUser,
    required this.onInterestSent,
    Key? key,
  }) : super(key: key);

  @override
  State<_AgentMembersBottomSheet> createState() =>
      _AgentMembersBottomSheetState();
}

class _AgentMembersBottomSheetState extends State<_AgentMembersBottomSheet>
    with WidgetsBindingObserver {
  List<Map<String, dynamic>> sortedMembers = [];
  bool isLoading = true;
  String error = '';
  Set<int> sentInterests = {}; // Track which members have interest sent

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _sortMembersByMatchPercentage();
    _checkSentInterests();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.resumed) {
      print(
          '🔄 DEBUG: Agent members bottom sheet resumed - refreshing interest status...');
      _checkSentInterests();
    }
  }

  // Sort members by match percentage (highest first)
  void _sortMembersByMatchPercentage() {
    setState(() {
      sortedMembers = List.from(widget.members);
      sortedMembers.sort((a, b) {
        final matchPercentageA = _calculateMatchPercentage(a);
        final matchPercentageB = _calculateMatchPercentage(b);
        return matchPercentageB.compareTo(matchPercentageA); // Descending order
      });
      isLoading = false;
    });

    print('✅ Sorted ${sortedMembers.length} members by match percentage');

    // Debug: Show top 3 matches with their percentages
    if (sortedMembers.isNotEmpty) {
      print('🏆 Top 3 Matches:');
      for (int i = 0; i < sortedMembers.length && i < 3; i++) {
        final member = sortedMembers[i];
        final matchPercentage = _calculateMatchPercentage(member);
        final memberName =
            '${member['first_name'] ?? ''} ${member['last_name'] ?? ''}';
        print('  ${i + 1}. $memberName - $matchPercentage%');
      }
    }
  }

  // Check which interests have already been sent by members to target user
  Future<void> _checkSentInterests() async {
    try {
      // Safely parse target user ID - handle both string and int types
      final dynamic targetUserIdRaw = widget.targetUser['id'];
      final int? targetUserId = targetUserIdRaw is int
          ? targetUserIdRaw
          : int.tryParse(targetUserIdRaw.toString());

      if (targetUserId == null) {
        print('❌ ERROR: Invalid target user ID: $targetUserIdRaw');
        return;
      }

      // API call to get sent interests for target user
      final response = await http.get(
        Uri.parse(
            'https://mehrammatchbackend-production.up.railway.app/api/recieved/?action_on_id=$targetUserId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> sentInterestsData = jsonDecode(response.body);

        print('🔍 DEBUG: Raw sent interests data: $sentInterestsData');
        print('🔍 DEBUG: Target user ID: $targetUserId');

        setState(() {
          // Only add action_by_id where the target user (action_on_id) has received interest (interest=true)
          sentInterests = sentInterestsData
              .where((record) {
                // Safely parse action_on_id - handle both string and int types
                final dynamic actionOnIdRaw = record['action_on_id'];
                final int? actionOnId = actionOnIdRaw is int
                    ? actionOnIdRaw
                    : int.tryParse(actionOnIdRaw.toString());

                return actionOnId == targetUserId && record['interest'] == true;
              })
              .map((record) {
                // Safely parse action_by_id - handle both string and int types
                final dynamic actionByIdRaw = record['action_by_id'];
                final int? actionById = actionByIdRaw is int
                    ? actionByIdRaw
                    : int.tryParse(actionByIdRaw.toString());

                return actionById ?? 0; // Return 0 if parsing fails
              })
              .where((id) => id > 0) // Filter out invalid IDs
              .toSet();
        });

        print('✅ DEBUG: Found ${sentInterests.length} sent interests');
        print('✅ DEBUG: Sent interests IDs: $sentInterests');
      }
    } catch (e) {
      print('❌ ERROR: Failed to check sent interests: $e');
    }
  }

  // Calculate match percentage between member and target user
  int _calculateMatchPercentage(Map<String, dynamic> member) {
    int score = 0;

    // Age compatibility (20-30 age difference is good)
    // Safely parse ages - handle both string and int types
    final dynamic memberAgeRaw = member['age'];
    final int memberAge = memberAgeRaw is int
        ? memberAgeRaw
        : int.tryParse(memberAgeRaw?.toString() ?? '') ?? 0;

    final dynamic targetAgeRaw = widget.targetUser['age'];
    final int targetAge = targetAgeRaw is int
        ? targetAgeRaw
        : int.tryParse(targetAgeRaw?.toString() ?? '') ?? 0;

    if ((memberAge - targetAge).abs() <= 5)
      score += 20;
    else if ((memberAge - targetAge).abs() <= 10) score += 15;

    // Location compatibility (same state is good)
    final String memberState = member['state'] ?? '';
    final String targetState = widget.targetUser['state'] ?? '';
    if (memberState.toLowerCase() == targetState.toLowerCase()) score += 25;

    // Education compatibility
    final String memberEducation = member['Education'] ?? '';
    final String targetEducation = widget.targetUser['Education'] ?? '';
    if (memberEducation.isNotEmpty && targetEducation.isNotEmpty) score += 15;

    // Profession compatibility
    final String memberProfession = member['profession'] ?? '';
    final String targetProfession = widget.targetUser['profession'] ?? '';
    if (memberProfession.isNotEmpty && targetProfession.isNotEmpty) score += 15;

    // Religious compatibility (same sect is good)
    final String memberSect = member['sect_school_info'] ?? '';
    final String targetSect = widget.targetUser['sect_school_info'] ?? '';
    if (memberSect.toLowerCase() == targetSect.toLowerCase()) score += 25;

    return score.clamp(0, 100);
  }

  // Get color based on match percentage
  Color _getMatchColor(int percentage) {
    if (percentage >= 80) return Colors.green.shade600;
    if (percentage >= 60) return Colors.orange.shade600;
    if (percentage >= 40) return Colors.yellow.shade700;
    return Colors.red.shade600;
  }

  // Handle interest button - Send interest from member to target user
  void _handleInterest(Map<String, dynamic> member) async {
    final String memberName =
        '${member['first_name'] ?? ''} ${member['last_name'] ?? ''}';
    final String targetUserName =
        '${widget.targetUser['first_name'] ?? ''} ${widget.targetUser['last_name'] ?? ''}';

    // Safely parse member ID - handle both string and int types
    final dynamic memberIdRaw = member['id'];
    final int? memberId =
        memberIdRaw is int ? memberIdRaw : int.tryParse(memberIdRaw.toString());

    // Safely parse target user ID - handle both string and int types
    final dynamic targetUserIdRaw = widget.targetUser['id'];
    final int? targetUserId = targetUserIdRaw is int
        ? targetUserIdRaw
        : int.tryParse(targetUserIdRaw.toString());

    if (memberId == null || targetUserId == null) {
      print(
          '❌ ERROR: Invalid IDs - memberId: $memberIdRaw, targetUserId: $targetUserIdRaw');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: Invalid user IDs'),
          backgroundColor: Colors.red.shade600,
        ),
      );
      return;
    }

    print(
        '🔍 DEBUG: Sending interest from $memberName (ID: $memberId) to $targetUserName (ID: $targetUserId)');

    // Show loading dialog first
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.pink.shade600),
                strokeWidth: 3,
              ),
              SizedBox(height: 16),
              Text(
                'Sending Interest...',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Please wait while we send interest from $memberName',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      },
    );

    try {
      // Real API call to send interest
      final response = await http.post(
        Uri.parse('https://mehrammatchbackend-production.up.railway.app/api/recieved/'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'action_by_id': memberId,
          'action_on_id': targetUserId,
          'interest': true,
        }),
      );

      final responseData = jsonDecode(response.body);
      print('✅ DEBUG: Interest API Response Status: ${response.statusCode}');
      print('✅ DEBUG: Interest API Response Body: $responseData');

      // Close loading dialog
      Navigator.of(context).pop();

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Refresh interest status from database for real-time update
        await _checkSentInterests();

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.favorite, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Interest sent from $memberName to $targetUserName! ❤️',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.green.shade600,
            duration: Duration(seconds: 4),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            margin: EdgeInsets.all(16),
          ),
        );

        // Call callback
        widget.onInterestSent(memberId);
      } else {
        throw Exception(
            'Failed to send interest: ${responseData['message'] ?? 'Unknown error'}');
      }
    } catch (e) {
      print('❌ ERROR: Failed to send interest: $e');

      // Close loading dialog
      Navigator.of(context).pop();

      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              Icon(Icons.error_outline, color: Colors.white, size: 20),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Failed to send interest. Please try again.',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          backgroundColor: Colors.red.shade600,
          duration: Duration(seconds: 4),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: EdgeInsets.all(16),
        ),
      );
    }
  }

  // Handle withdraw interest button - Withdraw interest from member to target user
  void _handleWithdrawInterest(Map<String, dynamic> member) async {
    final String memberName =
        '${member['first_name'] ?? ''} ${member['last_name'] ?? ''}';
    final String targetUserName =
        '${widget.targetUser['first_name'] ?? ''} ${widget.targetUser['last_name'] ?? ''}';

    // Safely parse member ID - handle both string and int types
    final dynamic memberIdRaw = member['id'];
    final int? memberId =
        memberIdRaw is int ? memberIdRaw : int.tryParse(memberIdRaw.toString());

    // Safely parse target user ID - handle both string and int types
    final dynamic targetUserIdRaw = widget.targetUser['id'];
    final int? targetUserId = targetUserIdRaw is int
        ? targetUserIdRaw
        : int.tryParse(targetUserIdRaw.toString());

    if (memberId == null || targetUserId == null) {
      print(
          '❌ ERROR: Invalid IDs - memberId: $memberIdRaw, targetUserId: $targetUserIdRaw');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: Invalid user IDs'),
          backgroundColor: Colors.red.shade600,
        ),
      );
      return;
    }

    print(
        '🔍 DEBUG: Withdrawing interest from $memberName (ID: $memberId) to $targetUserName (ID: $targetUserId)');

    // Show confirmation dialog first
    bool? shouldWithdraw = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Text(
            'Withdraw Interest?',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          content: Text(
            'Are you sure you want to withdraw interest from $memberName to $targetUserName? This action cannot be undone.',
            style: GoogleFonts.inter(
              fontSize: 14,
              color: Colors.grey.shade600,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text(
                'Cancel',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade600,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Withdraw',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        );
      },
    );

    if (shouldWithdraw != true) {
      return; // User cancelled
    }

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.red.shade600),
                strokeWidth: 3,
              ),
              SizedBox(height: 16),
              Text(
                'Withdrawing Interest...',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Please wait while we withdraw interest from $memberName',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      },
    );

    try {
      // Real API call to withdraw interest
      final response = await http.post(
        Uri.parse('https://mehrammatchbackend-production.up.railway.app/api/recieved/'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'action_by_id': memberId,
          'action_on_id': targetUserId,
          'interest': false, // Set interest to false to withdraw
        }),
      );

      final responseData = jsonDecode(response.body);
      print(
          '✅ DEBUG: Withdraw Interest API Response Status: ${response.statusCode}');
      print('✅ DEBUG: Withdraw Interest API Response Body: $responseData');

      // Close loading dialog
      Navigator.of(context).pop();

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Refresh interest status from database for real-time update
        await _checkSentInterests();

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.favorite_border, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Interest withdrawn from $memberName! 💔',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.orange.shade600,
            duration: Duration(seconds: 4),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            margin: EdgeInsets.all(16),
          ),
        );
      } else {
        throw Exception(
            'Failed to withdraw interest: ${responseData['message'] ?? 'Unknown error'}');
      }
    } catch (e) {
      print('❌ ERROR: Failed to withdraw interest: $e');

      // Close loading dialog
      Navigator.of(context).pop();

      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              Icon(Icons.error_outline, color: Colors.white, size: 20),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Failed to withdraw interest. Please try again.',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          backgroundColor: Colors.red.shade600,
          duration: Duration(seconds: 4),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: EdgeInsets.all(16),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final String targetUserName =
        '${widget.targetUser['first_name'] ?? ''} ${widget.targetUser['last_name'] ?? ''}';
    final String targetGender =
        widget.targetUser['gender']?.toString().toLowerCase() ?? '';
    final String oppositeGender = targetGender == 'male' ? 'Female' : 'Male';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 20,
            offset: Offset(0, -5),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Container(
            margin: EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Enhanced header with better design
          Container(
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.white, Colors.grey.shade50],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            child: Column(
              children: [
                // Main title with icon
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.pink.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.people_alt_rounded,
                        color: Colors.pink.shade600,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 12),
                    Text(
                      'All Members from You',
                      style: GoogleFonts.inter(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                // Subtitle with better styling
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.grey.shade200, width: 1),
                  ),
                  child: Text(
                    '$oppositeGender members in your list',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                SizedBox(height: 8),
                // Target user name with special styling
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.pink.shade100, Colors.pink.shade50],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'for $targetUserName',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.pink.shade700,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Divider(height: 1, color: Colors.grey.shade200),
          // Content
          Expanded(
            child: isLoading
                ? Center(child: CircularProgressIndicator())
                : error.isNotEmpty
                    ? Center(child: Text(error))
                    : sortedMembers.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.people_outline,
                                  size: 64,
                                  color: Colors.grey.shade400,
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'No $oppositeGender members found',
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey.shade600,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  'Please add some $oppositeGender members first',
                                  style: GoogleFonts.inter(
                                    fontSize: 14,
                                    color: Colors.grey.shade500,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: () async {
                              print(
                                  '🔄 DEBUG: Pull-to-refresh triggered in agent members - refreshing interest status...');
                              await _checkSentInterests();
                              print(
                                  '✅ DEBUG: Interest status refresh completed');
                            },
                            child: ListView.builder(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              itemCount: sortedMembers.length,
                              itemBuilder: (context, index) {
                                final member = sortedMembers[index];
                                return _buildMemberCard(member);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  // Build modern member card with match percentage and interest button
  Widget _buildMemberCard(Map<String, dynamic> member) {
    final String name =
        '${member['first_name'] ?? ''} ${member['last_name'] ?? ''}';
    final String photo = member['upload_photo'] ?? '';
    final int age = member['age'] is int
        ? member['age']
        : int.tryParse(member['age']?.toString() ?? '') ?? 0;
    final String city = member['city'] ?? '';
    final String state = member['state'] ?? '';
    final String location = [city, state].where((s) => s.isNotEmpty).join(', ');
    final String education = member['Education'] ?? 'Not specified';
    final String profession = member['profession'] ?? 'Not specified';
    final String maritalStatus = member['martial_status'] ?? 'Not specified';
    final String height = member['hieght'] ?? 'Not specified';

    // Calculate match percentage
    final int matchPercentage = _calculateMatchPercentage(member);

    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.grey.shade50],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header with match percentage
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                // Profile photo with match badge
                Stack(
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        image: photo.isNotEmpty && photo != 'null'
                            ? DecorationImage(
                                image: NetworkImage(photo.startsWith('http')
                                    ? photo
                                    : 'https://mehrammatchbackend-production.up.railway.app$photo'),
                                fit: BoxFit.cover,
                              )
                            : null,
                        color: Colors.grey.shade200,
                      ),
                      child: (photo.isEmpty || photo == 'null')
                          ? Icon(Icons.person,
                              color: Colors.grey.shade400, size: 28)
                          : null,
                    ),
                    // Match percentage badge
                    Positioned(
                      top: -5,
                      right: -5,
                      child: Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              _getMatchColor(matchPercentage),
                              _getMatchColor(matchPercentage).withOpacity(0.8)
                            ],
                          ),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: _getMatchColor(matchPercentage)
                                  .withOpacity(0.3),
                              blurRadius: 4,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          '$matchPercentage%',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(width: 16),
                // Profile info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name.trim().isNotEmpty ? name : 'No Name',
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.cake_outlined,
                              size: 16, color: Colors.grey.shade600),
                          SizedBox(width: 4),
                          Text(
                            age > 0 ? '$age years' : 'Age not specified',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          SizedBox(width: 12),
                          Icon(Icons.location_on_outlined,
                              size: 16, color: Colors.grey.shade600),
                          SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              location.isNotEmpty
                                  ? location
                                  : 'Location not specified',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: Colors.grey.shade600,
                                fontWeight: FontWeight.w500,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.school_outlined,
                              size: 16, color: Colors.grey.shade600),
                          SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              education,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: Colors.grey.shade600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 2),
                      Row(
                        children: [
                          Icon(Icons.work_outline,
                              size: 16, color: Colors.grey.shade600),
                          SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              profession,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: Colors.grey.shade600,
                              ),
                              overflow: TextOverflow.ellipsis,
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
          // Action button section with enhanced design
          Container(
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.grey.shade50, Colors.white],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(16)),
              border: Border(
                top: BorderSide(color: Colors.grey.shade200, width: 1),
              ),
            ),
            child: Column(
              children: [
                // Match percentage indicator
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: _getMatchColor(matchPercentage).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _getMatchColor(matchPercentage).withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.analytics_outlined,
                        color: _getMatchColor(matchPercentage),
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Match Compatibility: $matchPercentage%',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: _getMatchColor(matchPercentage),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 16),
                // Interest button with enhanced design
                Container(
                  width: double.infinity,
                  height: 52,
                  decoration: BoxDecoration(
                    gradient: () {
                      // Safely parse member ID for comparison
                      final dynamic memberIdRaw = member['id'];
                      final int? memberId = memberIdRaw is int
                          ? memberIdRaw
                          : int.tryParse(memberIdRaw.toString());

                      final isInterestSent =
                          memberId != null && sentInterests.contains(memberId);
                      print(
                          '🔍 DEBUG: Member ID ${member['id']} (parsed: $memberId) - isInterestSent: $isInterestSent');
                      return isInterestSent
                          ? LinearGradient(
                              colors: [
                                Colors.orange.shade400,
                                Colors.orange.shade600,
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            )
                          : LinearGradient(
                              colors: [
                                Colors.pink.shade400,
                                Colors.pink.shade600,
                                Colors.pinkAccent,
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            );
                    }(),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: () {
                      // Safely parse member ID for comparison
                      final dynamic memberIdRaw = member['id'];
                      final int? memberId = memberIdRaw is int
                          ? memberIdRaw
                          : int.tryParse(memberIdRaw.toString());

                      final isInterestSent =
                          memberId != null && sentInterests.contains(memberId);

                      return isInterestSent
                          ? [
                              BoxShadow(
                                color: Colors.orange.shade400.withOpacity(0.4),
                                blurRadius: 12,
                                offset: Offset(0, 6),
                                spreadRadius: 2,
                              ),
                            ]
                          : [
                              BoxShadow(
                                color: Colors.pink.shade400.withOpacity(0.4),
                                blurRadius: 12,
                                offset: Offset(0, 6),
                                spreadRadius: 2,
                              ),
                            ];
                    }(),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        // Safely parse member ID for comparison
                        final dynamic memberIdRaw = member['id'];
                        final int? memberId = memberIdRaw is int
                            ? memberIdRaw
                            : int.tryParse(memberIdRaw.toString());

                        // Debug: Log the current state
                        print(
                            '🔍 DEBUG: Button tapped for member ID: ${member['id']} (parsed: $memberId)');
                        print(
                            '🔍 DEBUG: Current sentInterests set: $sentInterests');
                        print(
                            '🔍 DEBUG: Is member ID in sentInterests: ${memberId != null && sentInterests.contains(memberId)}');

                        if (memberId != null &&
                            sentInterests.contains(memberId)) {
                          _handleWithdrawInterest(member);
                        } else {
                          _handleInterest(member);
                        }
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                () {
                                  // Safely parse member ID for comparison
                                  final dynamic memberIdRaw = member['id'];
                                  final int? memberId = memberIdRaw is int
                                      ? memberIdRaw
                                      : int.tryParse(memberIdRaw.toString());

                                  return memberId != null &&
                                          sentInterests.contains(memberId)
                                      ? Icons.favorite_border
                                      : Icons.favorite;
                                }(),
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                            SizedBox(width: 12),
                            Text(
                              () {
                                // Safely parse member ID for comparison
                                final dynamic memberIdRaw = member['id'];
                                final int? memberId = memberIdRaw is int
                                    ? memberIdRaw
                                    : int.tryParse(memberIdRaw.toString());

                                final isInterestSent = memberId != null &&
                                    sentInterests.contains(memberId);
                                print(
                                    '🔍 DEBUG: Button text for member ID ${member['id']} (parsed: $memberId) - isInterestSent: $isInterestSent');
                                return isInterestSent
                                    ? 'Withdraw Interest'
                                    : 'Send Interest';
                              }(),
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
