import pandas as pd

# Create a minimal Excel file with EXACT column names as required by the API
# Based on the API requirements from the backend

minimal_data = {
    'First Name': ['John'],
    'Last Name': ['Doe'],
    'DOB': ['1995-05-15'],
    'Password': ['password123'],
    'Confirm Password': ['password123'],
    'Gender': ['male'],
    'Height': ['5\'8"'],
    'Weight': ['70 kg'],
    'Skin Tone': ['Medium'],
    'Marital Status': ['single'],
    'City': ['Mumbai'],
    'State': ['Maharashtra'],
    'Country': ['India'],
    'Native City': ['Mumbai'],
    'Native State': ['Maharashtra'],
    'Native Country': ['India'],
    'Education': ['Graduate'],
    'Profession': ['Engineer'],
    'Disability': ['no'],
    'Type Of Disability': ['None'],
    'Sect School Info': ['Sunni'],
    'Islamic Practicing Level': ['Religious'],
    'Believe In Dargah Fatiha Niyah': ['Yes (Only Fatiha)'],
    'Father Name': ['Ahmed Khan'],
    'Father Occupation': ['Engineer'],
    'Mother Name': ['Fatima Khan'],
    'Mother Occupation': ['Teacher'],
    'Number Of Siblings': [2],
    'Number Of Brothers': [1],
    'Number Of Sisters': [1],
    'Family Type': ['Nuclear Family'],
    'Family Practicing Level': ['Religious'],
    'Photo Upload Privacy Option': ['No'],
    'Profile Visible': ['Visible to all']
}

# Create DataFrame
df = pd.DataFrame(minimal_data)

# Save as Excel file
df.to_excel('minimal_test.xlsx', index=False, engine='openpyxl')

print("✅ Minimal test Excel file created: minimal_test.xlsx")
print("📋 Contains 1 user with EXACT column names required by API")
print("🔧 Column names match API requirements exactly")
print("\n📊 User details:")
print("   - Name: John Doe")
print("   - DOB: 1995-05-15")
print("   - Gender: male")
print("   - City: Mumbai")
print("   - All required fields included")
print("\n⚠️  IMPORTANT: This file has EXACT column names as expected by the API")
print("🎯 Use this file to test if the API processes data correctly")
