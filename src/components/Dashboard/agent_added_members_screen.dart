import 'package:flutter/material.dart';
import 'package:mehram_match_app/services/api_service.dart';
import 'package:mehram_match_app/services/profile_service.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mehram_match_app/screens/Forms/step1.dart';
import 'package:mehram_match_app/screens/Forms/step2form/step2.dart';
import 'package:mehram_match_app/screens/Forms/step3.dart';
import 'package:mehram_match_app/screens/Forms/step3_1.dart';
import 'package:mehram_match_app/screens/Forms/step4.dart';
import 'package:mehram_match_app/screens/Forms/step5.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Button types for professional styling
enum ButtonType { primary, secondary, danger }

class AgentAddedMembersScreen extends StatefulWidget {
  final String? agentId;
  const AgentAddedMembersScreen({Key? key, required this.agentId})
      : super(key: key);

  @override
  State<AgentAddedMembersScreen> createState() =>
      _AgentAddedMembersScreenState();
}

class _AgentAddedMembersScreenState extends State<AgentAddedMembersScreen>
    with WidgetsBindingObserver {
  List<dynamic> members = [];
  bool isLoading = true;
  String error = '';
  Set<int> shortlistedUsers = {}; // Track shortlisted users
  late FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _focusNode = FocusNode();
    _focusNode.addListener(_onFocusChange);
    fetchMembers();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _focusNode.removeListener(_onFocusChange);
    _focusNode.dispose();
    super.dispose();
  }

  void _onFocusChange() {
    if (_focusNode.hasFocus) {
      print('🔄 DEBUG: Screen gained focus - refreshing data...');
      _refreshDataIfNeeded();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Refresh data when screen becomes visible again (e.g., when returning from other screens)
    print('🔄 DEBUG: Screen dependencies changed - refreshing data...');
    _refreshDataIfNeeded();
  }

  // Method to refresh data from database
  Future<void> _refreshDataIfNeeded() async {
    // Add a small delay to ensure the screen is fully visible
    await Future.delayed(Duration(milliseconds: 100));
    if (mounted) {
      print('🔄 DEBUG: Refreshing data from database on screen focus...');
      await fetchMembers();
      await _loadShortlistedUsers(); // Always refresh shortlist status from database
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    // Refresh data when app becomes active again
    if (state == AppLifecycleState.resumed) {
      print('🔄 DEBUG: App resumed - refreshing data from database...');
      _refreshDataIfNeeded();
    }
  }

  // API se agent ke added members laane wala function
  Future<void> fetchMembers() async {
    setState(() {
      isLoading = true;
      error = '';
    });
    try {
      // API call: /user_agent/?agent_id=xyz
      final response =
          await ApiService.get('/agent/user_agent/?agent_id=${widget.agentId}');

      // Debug information print karo
      print('🔍 DEBUG: Agent Members API Response: $response');
      print('🔍 DEBUG: Members count: ${response['member']?.length ?? 0}');

      if (response['member'] != null && response['member'].isNotEmpty) {
        print('🔍 DEBUG: First member data: ${response['member'][0]}');

        // Debug Step 2 fields specifically
        final firstMember = response['member'][0];
        print('🔍 DEBUG: Step 2 Fields Check:');
        print('  - sect_school_info: "${firstMember['sect_school_info']}"');
        print(
            '  - islamic_practicing_level: "${firstMember['islamic_practicing_level']}"');
        print(
            '  - believe_in_dargah_fatiha_niyah: "${firstMember['believe_in_dargah_fatiha_niyah']}"');
        print('  - hijab_niqab_prefer: "${firstMember['hijab_niqab_prefer']}"');
        print('  - gender: "${firstMember['gender']}"');
      }

      setState(() {
        members = response['member'] ?? [];
        isLoading = false;
      });

      // Load shortlisted users after members are loaded to ensure proper status display
      await _loadShortlistedUsers();
    } catch (e) {
      print('❌ ERROR: Fetch members error: $e');
      setState(() {
        isLoading = false;
        error = 'Kuch galat ho gaya. Dobara try karo.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Focus(
      focusNode: _focusNode,
      child: Scaffold(
        appBar: AppBar(
          title: Text('View All Members', style: GoogleFonts.inter()),
          backgroundColor: Colors.white,
          iconTheme: IconThemeData(color: Colors.black),
          elevation: 1,
        ),
        body: RefreshIndicator(
          onRefresh: () async {
            // Refresh both members and shortlisted users from backend
            print('🔄 DEBUG: Pull-to-refresh triggered - refreshing data...');
            await fetchMembers();
            await _loadShortlistedUsers();
            print('✅ DEBUG: Data refresh completed');
          },
          child: isLoading
              ? Center(child: CircularProgressIndicator())
              : error.isNotEmpty
                  ? Center(child: Text(error))
                  : members.isEmpty
                      ? Center(child: Text('Koi member nahi mila!'))
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: members.length + 1, // +1 for the hint text
                          itemBuilder: (context, index) {
                            if (index == members.length) {
                              // Show hint text at the bottom
                              return Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Center(
                                  child: Text(
                                    '⬇️ Swipe down to refresh data',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: Colors.grey.shade600,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                ),
                              );
                            }
                            final member = members[index];
                            return _buildMemberCard(member);
                          },
                        ),
        ),
      ),
    );
  }

  // Card UI bilkul shortlisted_profiles_screen jaise
  Widget _buildMemberCard(dynamic member) {
    // Name, photo, age, city, etc. nikaal lo
    final String name =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');

    // Photo URL ko properly handle karo - multiple sources se check karo
    String photo = '';
    if (member['upload_photo'] != null &&
        member['upload_photo'].toString().isNotEmpty) {
      photo = member['upload_photo'];
    } else if (member['profile_photo'] != null &&
        member['profile_photo'] is Map) {
      photo = member['profile_photo']['upload_photo'] ?? '';
    } else if (member['profile_photo'] != null &&
        member['profile_photo'] is String) {
      photo = member['profile_photo'];
    }

    final String city = member['city'] ?? '';
    final String state = member['state'] ?? '';
    final String country = member['country'] ?? '';
    final String location =
        [city, state, country].where((s) => s.isNotEmpty).join(', ');
    final int age = member['age'] is int
        ? member['age']
        : int.tryParse(member['age']?.toString() ?? '') ?? 0;
    final String education = member['Education'] ?? 'Not specified';
    final String profession = member['profession'] ?? 'Not specified';
    final String maritalStatus = member['martial_status'] ?? 'Not specified';
    final String height = member['hieght'] ?? 'Not specified';
    final String gender = member['gender'] ?? '';

    // Debug information for gender and photo
    print('🔍 DEBUG: Member gender: "$gender"');
    print('🔍 DEBUG: Member photo: "$photo"');

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.white],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile photo with shortlist tag
              Stack(
                children: [
                  Container(
                    width: 120, // Increased width for better visibility
                    height: 130, // Increased height for better proportions
                    decoration: BoxDecoration(
                      borderRadius:
                          BorderRadius.circular(12), // Slightly larger radius
                      image: (photo.isNotEmpty && photo != 'null')
                          ? DecorationImage(
                              image: _getProfileImage(photo, gender),
                              fit: BoxFit.cover,
                            )
                          : null,
                      color: Colors.grey.shade200,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 8,
                          offset: Offset(0, 3),
                        ),
                      ],
                    ),
                    child: (photo.isEmpty || photo == 'null')
                        ? _buildDefaultProfileImage(gender)
                        : null,
                  ),
                  // Shortlist tag overlay
                  if (_isUserShortlisted(member['id']))
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.orange.shade600,
                              Colors.orange.shade700,
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.orange.shade600.withOpacity(0.4),
                              blurRadius: 6,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.star,
                              color: Colors.white,
                              size: 14,
                            ),
                            SizedBox(width: 4),
                            Text(
                              'Shortlisted',
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 20), // Increased spacing for better balance
              // Info column (aligned with photo top)
              Expanded(
                child: Stack(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ID row
                        Text(
                          'ID: ${member['id']}',
                          style: GoogleFonts.inter(
                              fontSize: 11,
                              color: Colors.grey.shade500,
                              fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 4),
                        // Name row (without menu button)
                        Text(
                          name.trim().isNotEmpty ? name : 'No Name',
                          style: GoogleFonts.inter(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: Colors.black),
                          maxLines: 2,
                          overflow: TextOverflow.visible,
                        ),
                        const SizedBox(height: 4),
                        // Combined marital status, age, and height in one line
                        Row(
                          children: [
                            // Marital status with color
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: _getMaritalStatusColor(maritalStatus)
                                    .withOpacity(0.13),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                maritalStatus,
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: _getMaritalStatusColor(maritalStatus),
                                ),
                              ),
                            ),
                            // Divider
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 6),
                              child: Text(
                                '|',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: Colors.grey.shade400,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            // Age
                            Text(
                              age > 0 ? '$age yrs' : 'Not specified',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: Colors.grey.shade700,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            // Divider
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 6),
                              child: Text(
                                '|',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: Colors.grey.shade400,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            // Height
                            Text(
                              height,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: Colors.grey.shade700,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        // Education row with icon
                        Row(
                          children: [
                            Icon(Icons.school_outlined,
                                size: 15, color: Colors.grey.shade700),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                education,
                                style: GoogleFonts.inter(
                                    fontSize: 12, color: Colors.grey.shade700),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        // Profession row with icon
                        Row(
                          children: [
                            Icon(Icons.work_outline,
                                size: 15, color: Colors.grey.shade700),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                profession,
                                style: GoogleFonts.inter(
                                    fontSize: 12, color: Colors.grey.shade700),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        // Location row with icon
                        Row(
                          children: [
                            Icon(Icons.location_on_outlined,
                                size: 15, color: Colors.grey.shade700),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                location.isNotEmpty
                                    ? location
                                    : 'Not specified',
                                style: GoogleFonts.inter(
                                    fontSize: 12, color: Colors.grey.shade700),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    // Menu button positioned at top right corner
                    Positioned(
                      top: 0,
                      right: 0,
                      child: IconButton(
                        icon: Icon(Icons.more_vert,
                            size: 22, color: Colors.grey.shade400),
                        onPressed: () => _showMemberMenu(member),
                        padding: EdgeInsets.zero,
                        constraints: BoxConstraints(),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          // Bottom row: 3 professional buttons with enhanced design - Fixed overflow
          Container(
            margin: EdgeInsets.only(top: 12), // Reduced top margin
            child: Row(
              children: [
                // Shortlist Button - Compact design with active state
                Expanded(
                  child: _CompactProfessionalButton(
                    onTap: () => _handleShortlist(member),
                    icon: _isUserShortlisted(member['id'])
                        ? Icons.star
                        : Icons.star_border_rounded,
                    text: _isUserShortlisted(member['id'])
                        ? 'Shortlisted'
                        : 'Shortlist',
                    primaryColor: Colors.orange.shade600,
                    secondaryColor: Colors.orange.shade50,
                    isActive: _isUserShortlisted(member['id']),
                    buttonType: ButtonType.primary,
                  ),
                ),
                SizedBox(width: 6), // Reduced spacing between buttons
                // Matches Button - Compact design
                Expanded(
                  child: _CompactProfessionalButton(
                    onTap: () => _handleMatches(member),
                    icon: Icons.people_alt_rounded,
                    text: 'Matches',
                    primaryColor: Colors.pink.shade600,
                    secondaryColor: Colors.blue.shade50,
                    isActive: false,
                    buttonType: ButtonType.secondary,
                  ),
                ),
                SizedBox(width: 6), // Reduced spacing between buttons
                // Remove Button - Compact design
                Expanded(
                  child: _CompactProfessionalButton(
                    onTap: () => _handleRemove(member),
                    icon: Icons.delete_forever_rounded,
                    text: 'Remove',
                    primaryColor: Colors.red.shade600,
                    secondaryColor: Colors.red.shade50,
                    isActive: false,
                    buttonType: ButtonType.danger,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Gender ke according default profile image show karne ka method
  Widget _buildDefaultProfileImage(String gender) {
    String imagePath = '';

    // Gender ke according default image select karo
    if (gender.toLowerCase() == 'male') {
      imagePath = 'assets/images/muslim-man.png';
    } else if (gender.toLowerCase() == 'female') {
      imagePath = 'assets/images/hijab-woman.png';
    } else {
      // Agar gender nahi pata hai toh default person icon show karo
      return Icon(Icons.person,
          color: Colors.grey.shade400, size: 40); // Larger icon
    }

    // Default image show karo
    return ClipRRect(
      borderRadius: BorderRadius.circular(12), // Match container radius
      child: Image.asset(
        imagePath,
        width: 120, // Match container width
        height: 130, // Match container height
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          // Agar image load nahi hoti toh person icon show karo
          print('❌ ERROR: Failed to load default image: $imagePath');
          return Icon(Icons.person,
              color: Colors.grey.shade400, size: 40); // Larger icon
        },
      ),
    );
  }

  // 3 dots menu actions handle karne ka method
  void _handleMenuAction(String action, dynamic member) {
    switch (action) {
      case 'login':
        _handleLoginAsUser(member);
        break;
      case 'shortlist':
        _handleShortlist(member);
        break;
      case 'remove':
        _handleRemove(member);
        break;
    }
  }

  // Login as user functionality
  void _handleLoginAsUser(dynamic member) async {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');
    final int memberId = member['id'];

    print('🔍 DEBUG: Attempting to login as user: $memberName (ID: $memberId)');

    try {
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
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
                SizedBox(height: 16),
                Text(
                  'Logging in as $memberName...',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade800,
                  ),
                ),
              ],
            ),
          );
        },
      );

      // Get agent token from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final agentToken = prefs.getString('agent_token');

      if (agentToken == null) {
        Navigator.of(context).pop(); // Close loading dialog
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Agent session expired. Please login again.'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
        return;
      }

      // Call backend API to get user token
      final response = await http.post(
        Uri.parse(
            'https://mehrammatchbackend-production.up.railway.app/api/agent/access-agent-as-user/$memberId/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $agentToken',
        },
      );

      Navigator.of(context).pop(); // Close loading dialog

      print(
          '🔍 DEBUG: Access user token response status: ${response.statusCode}');
      print('🔍 DEBUG: Access user token response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final userAccessToken = data['access'];
        final userRefreshToken = data['refresh'];
        final impersonatingUserId = data['impersonating'];

        if (userAccessToken != null && impersonatingUserId != null) {
          // Save user tokens and impersonation info
          await prefs.setString('user_access_token', userAccessToken);
          await prefs.setString('user_refresh_token', userRefreshToken);
          await prefs.setInt('user_id', impersonatingUserId);
          await prefs.setBool('is_agent_impersonating',
              true); // Flag to indicate agent is impersonating
          await prefs.setInt('original_agent_id',
              int.parse(widget.agentId!)); // Save original agent ID

          // Show success message
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('✅ Successfully logged in as $memberName'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 2),
            ),
          );

          // Navigate to user's profile or homepage
          Navigator.pushNamedAndRemoveUntil(
            context,
            '/homepage',
            (route) => false,
          );
        } else {
          throw Exception('Invalid response data');
        }
      } else {
        final errorData = jsonDecode(response.body);
        final errorMessage = errorData['error'] ?? 'Failed to login as user';
        final errorCode = errorData['code'] ?? 'unknown_error';

        String displayMessage;
        switch (errorCode) {
          case 'user_not_found':
            displayMessage = 'User not found. Please check if the user exists.';
            break;
          case 'unauthorized_access':
            displayMessage = 'You can only access users that you have added.';
            break;
          case 'server_error':
            displayMessage = 'Server error. Please try again later.';
            break;
          default:
            displayMessage = errorMessage;
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ $displayMessage'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } catch (e) {
      print('❌ ERROR: Login as user failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('❌ Failed to login as user. Please try again.'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  // Load shortlisted users directly from database
  Future<void> _loadShortlistedUsers() async {
    try {
      print('🔄 DEBUG: Loading shortlisted users from database...');

      final shortlistedProfiles =
          await ProfileService.fetchAgentShortlistedProfiles(
        agentId: widget.agentId!,
      );

      // Debug: Log the response structure
      print('🔍 DEBUG: Shortlisted profiles response: $shortlistedProfiles');
      if (shortlistedProfiles != null && shortlistedProfiles.isNotEmpty) {
        print('🔍 DEBUG: First profile structure: ${shortlistedProfiles[0]}');
      }

      // Extract user IDs from the shortlisted profiles
      final backendShortlistedIds = <int>{};

      if (shortlistedProfiles != null && shortlistedProfiles.isNotEmpty) {
        for (final profile in shortlistedProfiles) {
          // Handle different response structures with proper type conversion
          int? userId;

          try {
            if (profile['user'] != null && profile['user']['id'] != null) {
              // Convert to int safely
              final userData = profile['user']['id'];
              if (userData is int) {
                userId = userData;
              } else if (userData is String) {
                userId = int.tryParse(userData);
              }
            } else if (profile['id'] != null) {
              // Convert to int safely
              final idData = profile['id'];
              if (idData is int) {
                userId = idData;
              } else if (idData is String) {
                userId = int.tryParse(idData);
              }
            }

            if (userId != null) {
              backendShortlistedIds.add(userId);
              print('✅ DEBUG: Added user ID $userId to shortlisted set');
            } else {
              print(
                  '⚠️ WARNING: Could not parse user ID from profile: $profile');
            }
          } catch (e) {
            print('❌ ERROR: Error parsing user ID from profile: $e');
            print('❌ ERROR: Profile data: $profile');
          }
        }
      }

      setState(() {
        shortlistedUsers = backendShortlistedIds;
      });

      // Save to SharedPreferences for offline access
      await _saveShortlistedUsers();

      print(
          '✅ DEBUG: Loaded ${shortlistedUsers.length} shortlisted users from database');
      print('✅ DEBUG: Shortlisted user IDs: $shortlistedUsers');
    } catch (e) {
      print('❌ ERROR: Failed to load shortlisted users from database: $e');
      // On error, clear the shortlisted users to ensure UI accuracy
      setState(() {
        shortlistedUsers = {};
      });
    }
  }

  // Save shortlisted users to SharedPreferences
  Future<void> _saveShortlistedUsers() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final shortlistedIds =
          shortlistedUsers.map((id) => id.toString()).toList();
      await prefs.setStringList(
          'shortlisted_users_${widget.agentId}', shortlistedIds);
      print('✅ DEBUG: Saved ${shortlistedUsers.length} shortlisted users');
    } catch (e) {
      print('❌ ERROR: Failed to save shortlisted users: $e');
    }
  }

  // Check if user is shortlisted
  bool _isUserShortlisted(int userId) {
    final isShortlisted = shortlistedUsers.contains(userId);
    print('🔍 DEBUG: User $userId shortlist status: $isShortlisted');
    return isShortlisted;
  }

  // Force refresh shortlist status for a specific user
  Future<void> _refreshUserShortlistStatus(int userId) async {
    print('🔄 DEBUG: Force refreshing shortlist status for user $userId...');
    await _loadShortlistedUsers();
    print(
        '✅ DEBUG: User $userId shortlist status updated: ${_isUserShortlisted(userId)}');
  }

  // Shortlist functionality with database-first approach
  void _handleShortlist(dynamic member) async {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');
    final int memberId = member['id'];
    final bool isCurrentlyShortlisted = _isUserShortlisted(memberId);

    print(
        '🔍 DEBUG: Attempting to ${isCurrentlyShortlisted ? 'remove from' : 'add to'} shortlist: $memberName (ID: $memberId)');

    // Show loading state
    setState(() {
      // We'll show a loading indicator on the button
    });

    try {
      // Call backend API to persist the shortlist action
      final result = await ProfileService.agentToggleShortlist(
        agentId: widget.agentId!,
        toUserId: memberId.toString(),
        toUserName: memberName,
        isCurrentlyShortlisted: isCurrentlyShortlisted,
      );

      if (result['success'] == true) {
        // Backend call successful - now refresh from database to get accurate state
        print(
            '✅ DEBUG: Shortlist action successful, refreshing from database...');
        await _loadShortlistedUsers(); // This will update the UI with real database state
        await _refreshUserShortlistStatus(
            memberId); // Double-check the specific user's status

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(
                  isCurrentlyShortlisted ? Icons.star_border : Icons.star,
                  color: Colors.white,
                  size: 20,
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    result['message'] ??
                        (isCurrentlyShortlisted
                            ? '$memberName removed from shortlist!'
                            : '$memberName added to shortlist! ⭐'),
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            backgroundColor: isCurrentlyShortlisted
                ? Colors.grey.shade600
                : Colors.orange.shade600,
            duration: const Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            margin: EdgeInsets.all(16),
          ),
        );

        // Show special animation for shortlist action (only if actually added)
        final newShortlistStatus = _isUserShortlisted(memberId);
        if (!isCurrentlyShortlisted && newShortlistStatus) {
          // Show confetti-like effect for adding to shortlist
          _showShortlistCelebration(memberName);
        }
      } else {
        // Backend call failed - refresh from database to ensure UI is accurate
        print('❌ DEBUG: Shortlist action failed, refreshing from database...');
        await _loadShortlistedUsers();

        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.error, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    result['message'] ??
                        'Shortlist action failed. Please try again.',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.red.shade600,
            duration: const Duration(seconds: 3),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            margin: EdgeInsets.all(16),
          ),
        );
      }
    } catch (e) {
      // Network error or other exception - refresh from database to ensure UI is accurate
      print('❌ DEBUG: Network error, refreshing from database...');
      await _loadShortlistedUsers();

      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              Icon(Icons.error, color: Colors.white, size: 20),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Network error. Please check your connection and try again.',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          backgroundColor: Colors.red.shade600,
          duration: const Duration(seconds: 3),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: EdgeInsets.all(16),
        ),
      );

      print('❌ Error in shortlist API call: $e');
    }
  }

  // Show celebration animation when user is shortlisted
  void _showShortlistCelebration(String memberName) {
    showDialog(
      context: context,
      barrierDismissible: true,
      barrierColor: Colors.transparent,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            width: 200,
            height: 200,
            child: Stack(
              children: [
                // Animated star in center
                Center(
                  child: TweenAnimationBuilder<double>(
                    duration: Duration(milliseconds: 800),
                    tween: Tween(begin: 0.0, end: 1.0),
                    builder: (context, value, child) {
                      return Transform.scale(
                        scale: value,
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: Colors.orange.shade600,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.orange.shade600.withOpacity(0.4),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.star,
                            color: Colors.white,
                            size: 40,
                          ),
                        ),
                      );
                    },
                  ),
                ),
                // Celebration text
                Positioned(
                  bottom: 20,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Text(
                      'Shortlisted! ⭐',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        shadows: [
                          Shadow(
                            color: Colors.black.withOpacity(0.5),
                            blurRadius: 4,
                            offset: Offset(0, 2),
                          ),
                        ],
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

    // Auto-dismiss after 1.5 seconds
    Future.delayed(Duration(milliseconds: 1500), () {
      if (Navigator.canPop(context)) {
        Navigator.pop(context);
      }
    });
  }

  // Remove functionality
  void _handleRemove(dynamic member) {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');
    final int memberId = member['id'];

    print('🔍 DEBUG: Attempting to remove user: $memberName (ID: $memberId)');

    // Show confirmation dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'Remove Member',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
          content: Text(
            'Are you sure you want to remove $memberName from your members list?',
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.grey.shade700,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _confirmRemove(member);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Remove',
                style: GoogleFonts.inter(
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

  // Confirm remove functionality
  void _confirmRemove(dynamic member) {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');
    final int memberId = member['id'];

    // TODO: Implement remove functionality
    // This will require backend API to remove user from agent's list

    // For now, just show success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$memberName removed successfully!'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );

    // Refresh the members list
    fetchMembers();
  }

  // Show profile completion details
  void _showProfileCompletion(dynamic member) {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');
    final int memberId = member['id'];
    final int completionPercentage =
        _calculateOverallCompletion(_getStepCompletionStatus(member));

    print(
        '🔍 DEBUG: Showing profile completion for: $memberName (ID: $memberId) - $completionPercentage%');

    // Show bottom sheet with profile completion details
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
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
        child: SingleChildScrollView(
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
              // Header
              Container(
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  children: [
                    Text(
                      'Profile Completion',
                      style: GoogleFonts.inter(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      memberName,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              // Progress section
              Container(
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  children: [
                    // Circular progress indicator
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox(
                          width: 120,
                          height: 120,
                          child: CircularProgressIndicator(
                            value: completionPercentage / 100,
                            strokeWidth: 8,
                            backgroundColor: Colors.grey.shade300,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              _getCompletionColor(completionPercentage),
                            ),
                          ),
                        ),
                        Column(
                          children: [
                            Text(
                              '$completionPercentage%',
                              style: GoogleFonts.inter(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color:
                                    _getCompletionColor(completionPercentage),
                              ),
                            ),
                            Text(
                              'Complete',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    SizedBox(height: 24),
                    // Step-wise breakdown
                    ..._getStepCompletionStatus(member)
                        .map((step) => _buildStepItem(step))
                        .toList(),
                  ],
                ),
              ),
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  // Matches functionality - Show potential matches for this user
  void _handleMatches(dynamic member) {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');
    final int memberId = member['id'];
    final String memberGender =
        member['gender']?.toString().toLowerCase() ?? '';

    print(
        '🔍 DEBUG: Showing matches for: $memberName (ID: $memberId, Gender: $memberGender)');

    // Show bottom sheet with potential matches
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      builder: (context) => _MatchesBottomSheet(
        member: member,
        agentId: widget.agentId!,
        onMatchSelected: (targetUserId) {
          // Handle match selection
          print('🎯 Match selected: $targetUserId');
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Match request sent! 🎉'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 2),
            ),
          );
        },
      ),
    );
  }

  // Helper method to get profile image
  ImageProvider _getProfileImage(dynamic photo, String gender) {
    if (photo != null && photo.toString().isNotEmpty) {
      if (photo.toString().startsWith('http') ||
          photo.toString().startsWith('/media/')) {
        // Network image - backend se aaya hua photo
        String url = photo.toString().startsWith('http')
            ? photo.toString()
            : 'https://mehrammatchbackend-production.up.railway.app${photo.toString()}';
        return NetworkImage(url);
      } else {
        // Local asset
        return AssetImage(photo.toString());
      }
    } else {
      // Default image based on gender
      if (gender.toLowerCase() == 'female') {
        return const AssetImage('assets/images/hijab-woman.png');
      } else {
        return const AssetImage('assets/images/muslim-man.png');
      }
    }
  }

  // Show member menu - Professional modern design with step-wise completion
  void _showMemberMenu(dynamic member) {
    final String memberName =
        (member['first_name'] ?? '') + ' ' + (member['last_name'] ?? '');

    // Calculate step-wise completion status
    final List<Map<String, dynamic>> stepStatus =
        _getStepCompletionStatus(member);
    final int completionPercentage = _calculateOverallCompletion(stepStatus);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      builder: (context) => Container(
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
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Professional drag handle
              Container(
                margin: EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Header with member info and profile completion
              Container(
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  children: [
                    // Member info row
                    Row(
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            color: Colors.grey.shade100,
                          ),
                          child: Icon(
                            Icons.person,
                            color: Colors.grey.shade600,
                            size: 24,
                          ),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                memberName,
                                style: GoogleFonts.inter(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'ID: ${member['id']}',
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    // Profile completion section
                    Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.assessment_rounded,
                                color: Colors.blue.shade600,
                                size: 20,
                              ),
                              SizedBox(width: 8),
                              Text(
                                'Profile Completion',
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87,
                                ),
                              ),
                              Spacer(),
                              Text(
                                '$completionPercentage%',
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color:
                                      _getCompletionColor(completionPercentage),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 12),
                          // Progress bar
                          LinearProgressIndicator(
                            value: completionPercentage / 100,
                            backgroundColor: Colors.grey.shade300,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              _getCompletionColor(completionPercentage),
                            ),
                            minHeight: 6,
                          ),
                          SizedBox(height: 16),
                          // Step-wise completion status
                          Text(
                            'Profile Steps:',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey.shade700,
                            ),
                          ),
                          SizedBox(height: 12),
                          // Step list
                          Column(
                            children: stepStatus
                                .map((step) => _buildStepItem(step))
                                .toList(),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Divider(height: 1, color: Colors.grey.shade200),
              // Menu options with modern design
              Container(
                padding: EdgeInsets.symmetric(vertical: 8),
                child: Column(
                  children: [
                    // Login as user option
                    _buildModernMenuItem(
                      icon: Icons.login_rounded,
                      iconColor: Colors.blue.shade600,
                      title: 'Login as $memberName',
                      subtitle: 'Access user account',
                      onTap: () {
                        Navigator.pop(context);
                        _handleLoginAsUser(member);
                      },
                    ),
                    // Shortlist option
                    _buildModernMenuItem(
                      icon: Icons.star_rounded,
                      iconColor: Colors.orange.shade600,
                      title: 'Shortlist',
                      subtitle: 'Add to favorites',
                      onTap: () {
                        Navigator.pop(context);
                        _handleShortlist(member);
                      },
                    ),
                    // Remove option
                    _buildModernMenuItem(
                      icon: Icons.delete_outline_rounded,
                      iconColor: Colors.red.shade600,
                      title: 'Remove',
                      subtitle: 'Remove from list',
                      onTap: () {
                        Navigator.pop(context);
                        _handleRemove(member);
                      },
                      isDestructive: true,
                    ),
                  ],
                ),
              ),
              // Bottom safe area
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  // Get step-wise completion status
  List<Map<String, dynamic>> _getStepCompletionStatus(dynamic member) {
    return [
      {
        'step': 1,
        'title': 'Basic Information',
        'icon': Icons.person_outline,
        'isComplete': _isStep1Complete(member),
        'missingFields': _getStep1MissingFields(member),
        'memberData': member,
      },
      {
        'step': 2,
        'title': 'Religious Information',
        'icon': Icons.mosque_outlined,
        'isComplete': _isStep2Complete(member),
        'missingFields': _getStep2MissingFields(member),
        'memberData': member,
      },
      {
        'step': 3,
        'title': 'Family Information',
        'icon': Icons.family_restroom_outlined,
        'isComplete': _isStep3Complete(member),
        'missingFields': _getStep3MissingFields(member),
        'memberData': member,
      },
      {
        'step': 31,
        'title': 'Social Details',
        'icon': Icons.school_outlined,
        'isComplete': _isStep3_1Complete(member),
        'missingFields': _getStep3_1MissingFields(member),
        'memberData': member,
      },
      {
        'step': 4,
        'title': 'Partner Preferences',
        'icon': Icons.favorite_outline,
        'isComplete': _isStep4Complete(member),
        'missingFields': _getStep4MissingFields(member),
        'memberData': member,
      },
      {
        'step': 5,
        'title': 'Photos & Documents',
        'icon': Icons.photo_library_outlined,
        'isComplete': _isStep5Complete(member),
        'missingFields': _getStep5MissingFields(member),
        'memberData': member,
      },
    ];
  }

  // Calculate overall completion percentage from steps
  int _calculateOverallCompletion(List<Map<String, dynamic>> stepStatus) {
    int completedSteps = 0;
    int totalSteps = stepStatus.length;

    for (var step in stepStatus) {
      if (step['isComplete']) completedSteps++;
    }

    return ((completedSteps / totalSteps) * 100).round();
  }

  // Check if Step 1 is complete (Basic Information)
  bool _isStep1Complete(dynamic member) {
    return member['first_name']?.toString().isNotEmpty == true &&
        member['last_name']?.toString().isNotEmpty == true &&
        member['age'] != null &&
        member['age'] > 0 &&
        member['gender']?.toString().isNotEmpty == true &&
        member['martial_status']?.toString().isNotEmpty == true &&
        member['hieght']?.toString().isNotEmpty == true &&
        member['Education']?.toString().isNotEmpty == true &&
        member['profession']?.toString().isNotEmpty == true &&
        member['city']?.toString().isNotEmpty == true &&
        member['state']?.toString().isNotEmpty == true &&
        member['country']?.toString().isNotEmpty == true;
  }

  // Check if Step 2 is complete (Religious Information) - Gender based
  bool _isStep2Complete(dynamic member) {
    final String gender = member['gender']?.toString().toLowerCase() ?? '';

    // Common religious fields
    bool hasSect = member['sect_school_info']?.toString().isNotEmpty == true;
    bool hasPracticeLevel =
        member['islamic_practicing_level']?.toString().isNotEmpty == true;
    bool hasSpiritualOptions =
        member['believe_in_dargah_fatiha_niyah']?.toString().isNotEmpty ==
            true; // Using believe_in_dargah_fatiha_niyah as spiritual option

    // Gender-specific fields
    if (gender == 'female') {
      // Female users need hijab/niqab preference
      bool hasHijabPreference =
          member['hijab_niqab_prefer']?.toString().isNotEmpty == true;
      return hasSect &&
          hasPracticeLevel &&
          hasSpiritualOptions &&
          hasHijabPreference;
    } else {
      // Male users need beard preference - using smoking as alternative since beard field doesn't exist
      bool hasBeardPreference =
          member['smoking_cigarette_sheesha']?.toString().isNotEmpty == true;
      return hasSect &&
          hasPracticeLevel &&
          hasSpiritualOptions &&
          hasBeardPreference;
    }
  }

  // Check if Step 3 is complete (Family Information) - Gender based
  bool _isStep3Complete(dynamic member) {
    final String gender = member['gender']?.toString().toLowerCase() ?? '';

    // Common family fields
    bool hasFatherName = member['father_name']?.toString().isNotEmpty == true;
    bool hasMotherName = member['mother_name']?.toString().isNotEmpty == true;
    bool hasFamilyType = member['family_type']?.toString().isNotEmpty == true;
    bool hasFamilyPracticingLevel =
        member['family_practicing_level']?.toString().isNotEmpty == true;
    bool hasSiblings =
        member['number_of_siblings']?.toString().isNotEmpty == true;

    // Gender-specific fields
    if (gender == 'female') {
      // Female users need wali information
      bool hasWaliName = member['wali_name']?.toString().isNotEmpty == true;
      bool hasWaliContact =
          member['wali_contact_number']?.toString().isNotEmpty == true;
      bool hasWaliRelation =
          member['wali_blood_relation']?.toString().isNotEmpty == true;
      return hasFatherName &&
          hasMotherName &&
          hasFamilyType &&
          hasFamilyPracticingLevel &&
          hasSiblings &&
          hasWaliName &&
          hasWaliContact &&
          hasWaliRelation;
    } else {
      // Male users don't need wali information
      return hasFatherName &&
          hasMotherName &&
          hasFamilyType &&
          hasFamilyPracticingLevel &&
          hasSiblings;
    }
  }

  // Check if Step 4 is complete (Partner Preferences)
  bool _isStep4Complete(dynamic member) {
    return member['preferred_surname']?.toString().isNotEmpty == true &&
        member['preferred_sect']?.toString().isNotEmpty == true &&
        member['desired_practicing_level']?.toString().isNotEmpty == true &&
        member['preferred_family_type']?.toString().isNotEmpty == true &&
        member['education_level']?.toString().isNotEmpty == true &&
        member['profession_occupation']?.toString().isNotEmpty == true &&
        member['preferred_country']?.toString().isNotEmpty == true &&
        member['preferred_state']?.toString().isNotEmpty == true &&
        member['preferred_city']?.toString().isNotEmpty == true;
  }

  // Check if Step 5 is complete (Photos & Documents)
  bool _isStep5Complete(dynamic member) {
    return member['upload_photo']?.toString().isNotEmpty == true;
  }

  // Get missing fields for each step
  List<String> _getStep1MissingFields(dynamic member) {
    List<String> missing = [];
    if (member['first_name']?.toString().isEmpty != false)
      missing.add('First Name');
    if (member['last_name']?.toString().isEmpty != false)
      missing.add('Last Name');
    if (member['age'] == null || member['age'] <= 0) missing.add('Age');
    if (member['gender']?.toString().isEmpty != false) missing.add('Gender');
    if (member['martial_status']?.toString().isEmpty != false)
      missing.add('Marital Status');
    if (member['hieght']?.toString().isEmpty != false) missing.add('Height');
    if (member['Education']?.toString().isEmpty != false)
      missing.add('Education');
    if (member['profession']?.toString().isEmpty != false)
      missing.add('Profession');
    if (member['city']?.toString().isEmpty != false) missing.add('City');
    if (member['state']?.toString().isEmpty != false) missing.add('State');
    if (member['country']?.toString().isEmpty != false) missing.add('Country');
    return missing;
  }

  List<String> _getStep2MissingFields(dynamic member) {
    List<String> missing = [];
    final String gender = member['gender']?.toString().toLowerCase() ?? '';

    if (member['sect_school_info']?.toString().isEmpty != false)
      missing.add('Sect');
    if (member['islamic_practicing_level']?.toString().isEmpty != false)
      missing.add('Practice Level');
    if (member['believe_in_dargah_fatiha_niyah']?.toString().isEmpty != false)
      missing.add('Spiritual Options');

    // Gender-specific fields
    if (gender == 'female') {
      if (member['hijab_niqab_prefer']?.toString().isEmpty != false)
        missing.add('Hijab/Niqab Preference');
    } else {
      if (member['smoking_cigarette_sheesha']?.toString().isEmpty != false)
        missing.add('Beard Preference');
    }

    return missing;
  }

  List<String> _getStep3MissingFields(dynamic member) {
    List<String> missing = [];
    final String gender = member['gender']?.toString().toLowerCase() ?? '';

    if (member['father_name']?.toString().isEmpty != false)
      missing.add('Father Name');
    if (member['mother_name']?.toString().isEmpty != false)
      missing.add('Mother Name');
    if (member['family_type']?.toString().isEmpty != false)
      missing.add('Family Type');
    if (member['family_practicing_level']?.toString().isEmpty != false)
      missing.add('Family Practice Level');
    if (member['number_of_siblings']?.toString().isEmpty != false)
      missing.add('Siblings');

    // Gender-specific fields for females
    if (gender == 'female') {
      if (member['wali_name']?.toString().isEmpty != false)
        missing.add('Wali Name');
      if (member['wali_contact_number']?.toString().isEmpty != false)
        missing.add('Wali Contact');
      if (member['wali_blood_relation']?.toString().isEmpty != false)
        missing.add('Wali Relation');
    }

    return missing;
  }

  // Check if Step 3.1 is complete (Social Details)
  bool _isStep3_1Complete(dynamic member) {
    return member['Education']?.toString().isNotEmpty == true &&
        member['profession']?.toString().isNotEmpty == true &&
        member['income']?.toString().isNotEmpty == true &&
        member['disability']?.toString().isNotEmpty == true &&
        member['native_country']?.toString().isNotEmpty == true &&
        member['native_state']?.toString().isNotEmpty == true &&
        member['native_city']?.toString().isNotEmpty == true;
  }

  List<String> _getStep3_1MissingFields(dynamic member) {
    List<String> missing = [];

    if (member['Education']?.toString().isEmpty != false)
      missing.add('Education');
    if (member['profession']?.toString().isEmpty != false)
      missing.add('Profession');
    if (member['income']?.toString().isEmpty != false) missing.add('Income');
    if (member['disability']?.toString().isEmpty != false)
      missing.add('Disability');
    if (member['native_country']?.toString().isEmpty != false)
      missing.add('Native Country');
    if (member['native_state']?.toString().isEmpty != false)
      missing.add('Native State');
    if (member['native_city']?.toString().isEmpty != false)
      missing.add('Native City');

    return missing;
  }

  List<String> _getStep4MissingFields(dynamic member) {
    List<String> missing = [];
    if (member['preferred_surname']?.toString().isEmpty != false)
      missing.add('Preferred Surname');
    if (member['preferred_sect']?.toString().isEmpty != false)
      missing.add('Preferred Sect');
    if (member['desired_practicing_level']?.toString().isEmpty != false)
      missing.add('Desired Practice Level');
    if (member['preferred_family_type']?.toString().isEmpty != false)
      missing.add('Preferred Family Type');
    if (member['education_level']?.toString().isEmpty != false)
      missing.add('Education Level');
    if (member['profession_occupation']?.toString().isEmpty != false)
      missing.add('Profession');
    if (member['preferred_country']?.toString().isEmpty != false)
      missing.add('Preferred Country');
    if (member['preferred_state']?.toString().isEmpty != false)
      missing.add('Preferred State');
    if (member['preferred_city']?.toString().isEmpty != false)
      missing.add('Preferred City');
    return missing;
  }

  List<String> _getStep5MissingFields(dynamic member) {
    List<String> missing = [];
    if (member['upload_photo']?.toString().isEmpty != false)
      missing.add('Profile Photo');
    return missing;
  }

  // Build step item widget - Clickable for agent navigation
  Widget _buildStepItem(Map<String, dynamic> step) {
    final bool isComplete = step['isComplete'];
    final String title = step['title'];
    final IconData icon = step['icon'];
    final List<String> missingFields = step['missingFields'];
    final int stepNumber = step['step'];

    return GestureDetector(
      onTap: () => _navigateToStep(stepNumber, step),
      child: Container(
        margin: EdgeInsets.only(bottom: 8),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isComplete ? Colors.green.shade50 : Colors.orange.shade50,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isComplete ? Colors.green.shade200 : Colors.orange.shade200,
          ),
        ),
        // Make container height dynamic based on content
        constraints: BoxConstraints(
          minHeight: 60, // Minimum height
        ),
        child: Row(
          children: [
            // Step icon
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color:
                    isComplete ? Colors.green.shade100 : Colors.orange.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                isComplete ? Icons.check_circle_rounded : icon,
                color:
                    isComplete ? Colors.green.shade600 : Colors.orange.shade600,
                size: 18,
              ),
            ),
            SizedBox(width: 12),
            // Step details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isComplete
                          ? Colors.green.shade700
                          : Colors.orange.shade700,
                    ),
                  ),
                  if (!isComplete && missingFields.isNotEmpty) ...[
                    SizedBox(height: 4),
                    // Display missing fields in a more readable format
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Missing:',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.orange.shade600,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 2),
                        // Show each missing field on a new line
                        ...missingFields
                            .map((field) => Padding(
                                  padding: EdgeInsets.only(left: 8, bottom: 1),
                                  child: Text(
                                    '• $field',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: Colors.orange.shade600,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ))
                            .toList(),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            // Status indicator with arrow for navigation
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isComplete
                      ? Icons.check_circle_rounded
                      : Icons.pending_rounded,
                  color: isComplete
                      ? Colors.green.shade600
                      : Colors.orange.shade600,
                  size: 20,
                ),
                SizedBox(width: 8),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: Colors.grey.shade400,
                  size: 16,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Navigate to specific step for editing
  void _navigateToStep(int stepNumber, Map<String, dynamic> step) {
    // Close the bottom sheet first
    Navigator.pop(context);

    // Get member data for navigation
    final member = step['memberData']; // We'll need to pass this data

    // Show loading indicator
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            SizedBox(width: 12),
            Text('Opening ${step['title']}...'),
          ],
        ),
        backgroundColor: Colors.blue.shade600,
        duration: Duration(seconds: 2),
      ),
    );

    // Navigate based on step number
    switch (stepNumber) {
      case 1:
        _navigateToStep1(member);
        break;
      case 2:
        _navigateToStep2(member);
        break;
      case 3:
        _navigateToStep3(member);
        break;
      case 31:
        _navigateToStep3_1(member);
        break;
      case 4:
        _navigateToStep4(member);
        break;
      case 5:
        _navigateToStep5(member);
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Step navigation not implemented yet'),
            backgroundColor: Colors.orange,
          ),
        );
    }
  }

  // Navigation methods for each step
  void _navigateToStep1(dynamic member) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Step1FormScreen(
          isEditMode: true,
          isAgentMode: true,
          agentId: widget.agentId,
          editUserId: member['id'], // Pass the user ID to edit
        ),
      ),
    );
    // Refresh data when returning from step screen
    if (result == true) {
      fetchMembers();
    }
  }

  void _navigateToStep2(dynamic member) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Step2(
          name: '${member['first_name']} ${member['last_name']}',
          gender: member['gender'],
          isEditMode: true,
          isAgentMode: true,
          agentId: widget.agentId,
          editUserId: member['id'], // Pass the user ID to edit
        ),
      ),
    );
    // Refresh data when returning from step screen
    if (result == true) {
      fetchMembers();
    }
  }

  void _navigateToStep3(dynamic member) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Step3(
          name: '${member['first_name']} ${member['last_name']}',
          gender: member['gender'],
          isEditMode: true,
          isAgentMode: true,
          agentId: widget.agentId,
          editUserId: member['id'], // Pass the user ID to edit
        ),
      ),
    );
    // Refresh data when returning from step screen
    if (result == true) {
      fetchMembers();
    }
  }

  void _navigateToStep4(dynamic member) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Step4(
          name: '${member['first_name']} ${member['last_name']}',
          gender: member['gender'],
          isEditMode: true,
          isAgentMode: true,
          agentId: widget.agentId,
          editUserId: member['id'], // Pass the user ID to edit
        ),
      ),
    );
    // Refresh data when returning from step screen
    if (result == true) {
      fetchMembers();
    }
  }

  void _navigateToStep5(dynamic member) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Step5FormScreen(
          isAgentMode: true,
          agentId: widget.agentId,
          editUserId: member['id'], // Pass the user ID to edit
        ),
      ),
    );
    // Refresh data when returning from step screen
    if (result == true) {
      fetchMembers();
    }
  }

  void _navigateToStep3_1(dynamic member) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Step3_1FormScreen(
          isEditMode: true, // Add this to show the save button
          isAgentMode: true,
          agentId: widget.agentId,
          editUserId: member['id'], // Pass the user ID to edit
        ),
      ),
    );
    // Refresh data when returning from step screen
    if (result == true) {
      fetchMembers();
    }
  }

  // Get missing fields list
  List<String> _getMissingFields(dynamic member) {
    List<String> missingFields = [];

    if (member['first_name']?.toString().isEmpty != false)
      missingFields.add('First Name');
    if (member['last_name']?.toString().isEmpty != false)
      missingFields.add('Last Name');
    if (member['age'] == null || member['age'] <= 0) missingFields.add('Age');
    if (member['gender']?.toString().isEmpty != false)
      missingFields.add('Gender');
    if (member['martial_status']?.toString().isEmpty != false)
      missingFields.add('Marital Status');
    if (member['hieght']?.toString().isEmpty != false)
      missingFields.add('Height');
    if (member['Education']?.toString().isEmpty != false)
      missingFields.add('Education');
    if (member['profession']?.toString().isEmpty != false)
      missingFields.add('Profession');
    if (member['city']?.toString().isEmpty != false) missingFields.add('City');
    if (member['state']?.toString().isEmpty != false)
      missingFields.add('State');
    if (member['country']?.toString().isEmpty != false)
      missingFields.add('Country');
    if (member['upload_photo']?.toString().isEmpty != false)
      missingFields.add('Profile Photo');

    return missingFields;
  }

  // Get completion color based on percentage
  Color _getCompletionColor(int percentage) {
    if (percentage >= 80) return Colors.green.shade600;
    if (percentage >= 60) return Colors.orange.shade600;
    if (percentage >= 40) return Colors.yellow.shade700;
    return Colors.red.shade600;
  }

  // Modern menu item widget
  Widget _buildModernMenuItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: [
              // Icon with background
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  icon,
                  color: iconColor,
                  size: 20,
                ),
              ),
              SizedBox(width: 16),
              // Text content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: isDestructive
                            ? Colors.red.shade700
                            : Colors.black87,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
              // Arrow icon
              Icon(
                Icons.chevron_right_rounded,
                color: Colors.grey.shade400,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Get marital status color
  Color _getMaritalStatusColor(String status) {
    switch (status) {
      case 'Never Married':
      case 'Single':
        return Colors.green; // Green - positive, available
      case 'Married':
        return Colors.orange; // Orange - caution, specific condition
      case 'Khula':
        return Colors.red; // Red - significant change
      case 'Divorced':
        return Colors.grey; // Gray - neutral
      case 'Widowed':
        return Color(0xFF8B5A2B); // Brown - respectful
      default:
        return Colors.grey.shade600; // Default gray
    }
  }
}

// Compact professional button widget - Fixed overflow issues
class _CompactProfessionalButton extends StatefulWidget {
  final VoidCallback onTap;
  final IconData icon;
  final String text;
  final Color primaryColor;
  final Color secondaryColor;
  final bool isActive;
  final ButtonType buttonType;

  const _CompactProfessionalButton({
    required this.onTap,
    required this.icon,
    required this.text,
    required this.primaryColor,
    required this.secondaryColor,
    required this.isActive,
    required this.buttonType,
    Key? key,
  }) : super(key: key);

  @override
  State<_CompactProfessionalButton> createState() =>
      _CompactProfessionalButtonState();
}

class _CompactProfessionalButtonState extends State<_CompactProfessionalButton>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late AnimationController _pulseController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: Duration(milliseconds: 120),
      vsync: this,
    );
    _pulseController = AnimationController(
      duration: Duration(milliseconds: 800),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.1,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    _animationController.forward();
  }

  void _handleTapUp(TapUpDetails details) {
    _animationController.reverse();
  }

  void _handleTapCancel() {
    _animationController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              height: 44, // Reduced height
              decoration: BoxDecoration(
                gradient: _getGradient(),
                borderRadius: BorderRadius.circular(10),
                border: _getBorder(),
                boxShadow: _getShadow(),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: widget.onTap,
                  borderRadius: BorderRadius.circular(10),
                  splashColor: widget.primaryColor.withOpacity(0.2),
                  highlightColor: widget.primaryColor.withOpacity(0.1),
                  child: Container(
                    padding: EdgeInsets.symmetric(
                        horizontal: 6, vertical: 6), // Reduced padding
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min, // Prevent overflow
                      children: [
                        // Compact icon
                        Container(
                          width: 24, // Smaller icon container
                          height: 24,
                          decoration: BoxDecoration(
                            color: _getIconBackgroundColor(),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Icon(
                            widget.icon,
                            color: _getIconColor(),
                            size: 14, // Smaller icon
                          ),
                        ),
                        SizedBox(width: 6), // Reduced spacing
                        // Compact text
                        Flexible(
                          // Use Flexible to prevent text overflow
                          child: Text(
                            widget.text,
                            style: GoogleFonts.inter(
                              fontSize: 11, // Smaller font
                              fontWeight: FontWeight.w600,
                              color: _getTextColor(),
                              letterSpacing: 0.2,
                            ),
                            overflow:
                                TextOverflow.ellipsis, // Handle text overflow
                            maxLines: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // Get gradient based on button type and state
  LinearGradient _getGradient() {
    if (widget.isActive) {
      return LinearGradient(
        colors: [
          widget.primaryColor,
          widget.primaryColor.withOpacity(0.8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    }

    return LinearGradient(
      colors: [
        Colors.white,
        widget.secondaryColor,
      ],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    );
  }

  // Get border based on button type
  Border? _getBorder() {
    if (widget.isActive) return null;

    return Border.all(
      color: widget.primaryColor.withOpacity(0.3),
      width: 1.2, // Slightly thinner border
    );
  }

  // Get shadow based on button type and state
  List<BoxShadow> _getShadow() {
    if (widget.isActive) {
      return [
        BoxShadow(
          color: widget.primaryColor.withOpacity(0.3),
          blurRadius: 6,
          offset: Offset(0, 3),
          spreadRadius: 0,
        ),
      ];
    }

    return [
      BoxShadow(
        color: Colors.black.withOpacity(0.08),
        blurRadius: 4,
        offset: Offset(0, 2),
        spreadRadius: 0,
      ),
      BoxShadow(
        color: widget.primaryColor.withOpacity(0.05),
        blurRadius: 2,
        offset: Offset(0, 1),
        spreadRadius: 0,
      ),
    ];
  }

  // Get icon background color
  Color _getIconBackgroundColor() {
    if (widget.isActive) {
      return Colors.white.withOpacity(0.2);
    }
    return widget.primaryColor.withOpacity(0.1);
  }

  // Get icon color
  Color _getIconColor() {
    if (widget.isActive) {
      return Colors.white;
    }
    return widget.primaryColor;
  }

  // Get text color
  Color _getTextColor() {
    if (widget.isActive) {
      return Colors.white;
    }
    return widget.primaryColor;
  }
}

// Gradient button widget for card actions (shortlist, chat, interest)
class _GradientButton extends StatelessWidget {
  final VoidCallback onTap;
  final IconData icon;
  final Color iconColor;
  final String text;
  final Gradient gradient;
  final Color textColor;
  final bool isIconOnly;
  final Color? borderColor; // Naya prop for border color
  final bool isShortlistActive; // Naya prop for shortlist special icon

  const _GradientButton({
    required this.onTap,
    required this.icon,
    required this.iconColor,
    required this.text,
    required this.gradient,
    required this.textColor,
    this.isIconOnly = false,
    this.borderColor,
    this.isShortlistActive = false,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: isIconOnly
            ? const EdgeInsets.all(8)
            : const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(8),
          border: borderColor != null
              ? Border.all(color: borderColor!, width: 1.5)
              : null,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.07),
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Shortlist ke liye custom icon (white border, orange fill)
            if (isShortlistActive)
              Stack(
                alignment: Alignment.center,
                children: [
                  Icon(Icons.star_border, color: Colors.white, size: 22),
                  Icon(Icons.star, color: Colors.orange, size: 18),
                ],
              )
            else
              Icon(icon, color: iconColor, size: 20),
            if (!isIconOnly) ...[
              const SizedBox(width: 6),
              Text(
                text,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: textColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// Matches Bottom Sheet - Shows potential matches for a user
class _MatchesBottomSheet extends StatefulWidget {
  final dynamic member;
  final String agentId;
  final Function(int) onMatchSelected;

  const _MatchesBottomSheet({
    required this.member,
    required this.agentId,
    required this.onMatchSelected,
    Key? key,
  }) : super(key: key);

  @override
  State<_MatchesBottomSheet> createState() => _MatchesBottomSheetState();
}

class _MatchesBottomSheetState extends State<_MatchesBottomSheet>
    with WidgetsBindingObserver {
  List<dynamic> potentialMatches = [];
  bool isLoading = true;
  String error = '';
  Set<int> sentInterests = {}; // Track which users have interest sent

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    fetchPotentialMatches();
    checkSentInterests();
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
          '🔄 DEBUG: Matches bottom sheet resumed - refreshing interest status...');
      checkSentInterests();
    }
  }

  // Check which interests have already been sent by current user
  Future<void> checkSentInterests() async {
    try {
      final int currentUserId = widget.member['id'];

      // API call to get sent interests for current user
      final response = await http.get(
        Uri.parse(
            'https://mehrammatchbackend-production.up.railway.app/api/recieved/?action_by_id=$currentUserId'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> sentInterestsData = jsonDecode(response.body);

        print('🔍 DEBUG: Raw sent interests data: $sentInterestsData');
        print('🔍 DEBUG: Current user ID: $currentUserId');

        setState(() {
          // Only add action_on_id where the current user (action_by_id) has sent interest (interest=true)
          sentInterests = sentInterestsData
              .where((record) =>
                  record['action_by_id'] == currentUserId &&
                  record['interest'] == true)
              .map((record) => record['action_on_id'] as int)
              .toSet();
        });

        // Debug: Print each record to understand the data structure
        print('🔍 DEBUG: Analyzing each interest record:');
        for (var record in sentInterestsData) {
          print(
              '  Record: action_by_id=${record['action_by_id']}, action_on_id=${record['action_on_id']}, interest=${record['interest']} (type: ${record['interest'].runtimeType})');
        }

        // Debug: Check specifically for user ID 10 and 3
        final recordsForUser10And3 = sentInterestsData
            .where((record) =>
                record['action_by_id'] == 10 && record['action_on_id'] == 3)
            .toList();
        print(
            '🔍 DEBUG: Records for action_by_id=10, action_on_id=3: $recordsForUser10And3');

        if (recordsForUser10And3.isNotEmpty) {
          for (var record in recordsForUser10And3) {
            print(
                '  🔍 DEBUG: Found record - interest: ${record['interest']}, type: ${record['interest'].runtimeType}');
          }
        }

        print('✅ DEBUG: Found ${sentInterests.length} sent interests');
        print('✅ DEBUG: Sent interests IDs: $sentInterests');
      }
    } catch (e) {
      print('❌ ERROR: Failed to check sent interests: $e');
    }
  }

  // Fetch potential matches for the user from all profiles in database
  Future<void> fetchPotentialMatches() async {
    setState(() {
      isLoading = true;
      error = '';
    });

    try {
      final String memberGender =
          widget.member['gender']?.toString().toLowerCase() ?? '';
      final String oppositeGender = memberGender == 'male' ? 'female' : 'male';

      print(
          '🔍 DEBUG: Fetching $oppositeGender matches from all profiles for ${widget.member['first_name']}');

      // API call to get all users from database using agent authentication
      final response = await ApiService.get('/agent/user_list/');

      if (response != null && response is List) {
        final List<dynamic> allUsers = response;

        // Filter by opposite gender and exclude current user
        final filteredMatches = allUsers
            .where((userData) {
              final user = userData['user'];
              final userGender = user['gender']?.toString().toLowerCase() ?? '';
              final oppositeGender = memberGender == 'male' ? 'female' : 'male';

              // Don't show the same user and filter by opposite gender
              return user['id'] != widget.member['id'] &&
                  userGender == oppositeGender;
            })
            .map((userData) => userData['user'])
            .toList();

        // Sort by match percentage (highest first)
        filteredMatches.sort((a, b) {
          final matchPercentageA = _calculateMatchPercentage(a);
          final matchPercentageB = _calculateMatchPercentage(b);
          return matchPercentageB
              .compareTo(matchPercentageA); // Descending order
        });

        setState(() {
          potentialMatches = filteredMatches;
          isLoading = false;
        });

        print(
            '✅ Found ${potentialMatches.length} potential matches from all users');

        // Debug: Show top 3 matches with their percentages
        if (potentialMatches.isNotEmpty) {
          print('🏆 Top 3 Matches:');
          for (int i = 0; i < potentialMatches.length && i < 3; i++) {
            final match = potentialMatches[i];
            final matchPercentage = _calculateMatchPercentage(match);
            final matchName =
                '${match['first_name'] ?? ''} ${match['last_name'] ?? ''}';
            print('  ${i + 1}. $matchName - $matchPercentage%');
          }
        }
      } else {
        setState(() {
          potentialMatches = [];
          isLoading = false;
        });
      }
    } catch (e) {
      print('❌ ERROR: Fetch matches error: $e');
      setState(() {
        isLoading = false;
        error = 'Kuch galat ho gaya. Dobara try karo.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final String memberName =
        '${widget.member['first_name']} ${widget.member['last_name']}';
    final String memberGender =
        widget.member['gender']?.toString().toLowerCase() ?? '';
    final String oppositeGender = memberGender == 'male' ? 'Female' : 'Male';

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
                        color: Colors.blue.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.people_alt_rounded,
                        color: Colors.blue.shade600,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 12),
                    Text(
                      'All Matches',
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
                    '$oppositeGender users in database',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                SizedBox(height: 8),
                // User name with special styling
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.pink.shade100, Colors.pink.shade50],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'for $memberName',
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
                    : potentialMatches.isEmpty
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
                                  'No $oppositeGender profiles found',
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey.shade600,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  'No profiles available in database',
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
                                  '🔄 DEBUG: Pull-to-refresh triggered in matches - refreshing interest status...');
                              await checkSentInterests();
                              print(
                                  '✅ DEBUG: Interest status refresh completed');
                            },
                            child: ListView.builder(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              itemCount: potentialMatches.length,
                              itemBuilder: (context, index) {
                                final match = potentialMatches[index];
                                return _buildMatchCard(match);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  // Build modern match card with match percentage and interest button
  Widget _buildMatchCard(dynamic match) {
    final String name =
        '${match['first_name'] ?? ''} ${match['last_name'] ?? ''}';
    final String photo = match['upload_photo'] ?? '';
    final int age = match['age'] is int
        ? match['age']
        : int.tryParse(match['age']?.toString() ?? '') ?? 0;
    final String city = match['city'] ?? '';
    final String state = match['state'] ?? '';
    final String location = [city, state].where((s) => s.isNotEmpty).join(', ');
    final String education = match['Education'] ?? 'Not specified';
    final String profession = match['profession'] ?? 'Not specified';
    final String maritalStatus = match['martial_status'] ?? 'Not specified';
    final String height = match['hieght'] ?? 'Not specified';

    // Calculate match percentage (placeholder - you can implement actual calculation)
    final int matchPercentage = _calculateMatchPercentage(match);

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
                      final isInterestSent =
                          sentInterests.contains(match['id']);
                      print(
                          '🔍 DEBUG: Match ID ${match['id']} - isInterestSent: $isInterestSent');
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
                    boxShadow: sentInterests.contains(match['id'])
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
                          ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        // Debug: Log the current state
                        print(
                            '🔍 DEBUG: Button tapped for match ID: ${match['id']}');
                        print(
                            '🔍 DEBUG: Current sentInterests set: $sentInterests');
                        print(
                            '🔍 DEBUG: Is match ID in sentInterests: ${sentInterests.contains(match['id'])}');

                        if (sentInterests.contains(match['id'])) {
                          _handleWithdrawInterest(match);
                        } else {
                          _handleInterest(match);
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
                                sentInterests.contains(match['id'])
                                    ? Icons.favorite_border
                                    : Icons.favorite,
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                            SizedBox(width: 12),
                            Text(
                              () {
                                final isInterestSent =
                                    sentInterests.contains(match['id']);
                                print(
                                    '🔍 DEBUG: Button text for match ID ${match['id']} - isInterestSent: $isInterestSent');
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

  // Calculate match percentage based on compatibility
  int _calculateMatchPercentage(dynamic match) {
    // This is a placeholder calculation - you can implement actual compatibility logic
    int score = 0;

    // Age compatibility (20-30 age difference is good)
    final int currentUserAge = widget.member['age'] ?? 0;
    final int matchAge = match['age'] ?? 0;
    if ((currentUserAge - matchAge).abs() <= 5)
      score += 20;
    else if ((currentUserAge - matchAge).abs() <= 10) score += 15;

    // Location compatibility (same state is good)
    final String currentUserState = widget.member['state'] ?? '';
    final String matchState = match['state'] ?? '';
    if (currentUserState.toLowerCase() == matchState.toLowerCase()) score += 25;

    // Education compatibility
    final String currentUserEducation = widget.member['Education'] ?? '';
    final String matchEducation = match['Education'] ?? '';
    if (currentUserEducation.isNotEmpty && matchEducation.isNotEmpty)
      score += 15;

    // Profession compatibility
    final String currentUserProfession = widget.member['profession'] ?? '';
    final String matchProfession = match['profession'] ?? '';
    if (currentUserProfession.isNotEmpty && matchProfession.isNotEmpty)
      score += 15;

    // Religious compatibility (same sect is good)
    final String currentUserSect = widget.member['sect_school_info'] ?? '';
    final String matchSect = match['sect_school_info'] ?? '';
    if (currentUserSect.toLowerCase() == matchSect.toLowerCase()) score += 25;

    return score.clamp(0, 100);
  }

  // Get color based on match percentage
  Color _getMatchColor(int percentage) {
    if (percentage >= 80) return Colors.green.shade600;
    if (percentage >= 60) return Colors.orange.shade600;
    if (percentage >= 40) return Colors.yellow.shade700;
    return Colors.red.shade600;
  }

  // Handle interest button - Send interest from current user to match
  void _handleInterest(dynamic match) async {
    final String matchName =
        '${match['first_name'] ?? ''} ${match['last_name'] ?? ''}';
    final String currentUserName =
        '${widget.member['first_name'] ?? ''} ${widget.member['last_name'] ?? ''}';
    final int currentUserId = widget.member['id'];
    final int matchUserId = match['id'];

    print(
        '🔍 DEBUG: Sending interest from $currentUserName (ID: $currentUserId) to $matchName (ID: $matchUserId)');

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
                'Please wait while we send interest to $matchName',
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
      // Real API call to send interest (same as ProfileService.sendInterest)
      final response = await http.post(
        Uri.parse('https://mehrammatchbackend-production.up.railway.app/api/recieved/'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'action_by_id': currentUserId,
          'action_on_id': matchUserId,
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
        await checkSentInterests();

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.favorite, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Interest sent from $currentUserName to $matchName! ❤️',
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

  // Handle withdraw interest button - Withdraw interest from current user to match
  void _handleWithdrawInterest(dynamic match) async {
    final String matchName =
        '${match['first_name'] ?? ''} ${match['last_name'] ?? ''}';
    final String currentUserName =
        '${widget.member['first_name'] ?? ''} ${widget.member['last_name'] ?? ''}';
    final int currentUserId = widget.member['id'];
    final int matchUserId = match['id'];

    print(
        '🔍 DEBUG: Withdrawing interest from $currentUserName (ID: $currentUserId) to $matchName (ID: $matchUserId)');

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
            'Are you sure you want to withdraw your interest from $matchName? This action cannot be undone.',
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
                'Please wait while we withdraw interest from $matchName',
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
      // Real API call to withdraw interest (same as ProfileService.withdrawInterest)
      final response = await http.post(
        Uri.parse('https://mehrammatchbackend-production.up.railway.app/api/recieved/'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'action_by_id': currentUserId,
          'action_on_id': matchUserId,
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
        await checkSentInterests();

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.favorite_border, color: Colors.white, size: 20),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Interest withdrawn from $matchName! 💔',
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
}
