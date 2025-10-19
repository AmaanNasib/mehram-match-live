import pandas as pd

def check_excel_columns(file_path):
    """Check the column names in an Excel file"""
    try:
        # Read the Excel file
        df = pd.read_excel(file_path)
        
        print(f"📁 File: {file_path}")
        print(f"📊 Total rows: {len(df)}")
        print(f"📋 Total columns: {len(df.columns)}")
        print("\n🔍 Column names in your Excel file:")
        
        for i, col in enumerate(df.columns, 1):
            print(f"   {i:2d}. '{col}'")
        
        print("\n📝 Required columns by API:")
        required_columns = [
            "First Name", "Last Name", "DOB", "Password", "Confirm Password", 
            "Gender", "Height", "Weight", "Skin Tone", "Marital Status", 
            "City", "State", "Country", "Native City", "Native State", 
            "Native Country", "Education", "Profession", "Disability", 
            "Type Of Disability", "Sect School Info", "Islamic Practicing Level", 
            "Believe In Dargah Fatiha Niyah", "Father Name", "Father Occupation", 
            "Mother Name", "Mother Occupation", "Number Of Siblings", 
            "Number Of Brothers", "Number Of Sisters", "Family Type", 
            "Family Practicing Level", "Photo Upload Privacy Option", "Profile Visible"
        ]
        
        for i, col in enumerate(required_columns, 1):
            print(f"   {i:2d}. '{col}'")
        
        print("\n🔍 Comparison:")
        missing_columns = []
        extra_columns = []
        
        for col in required_columns:
            if col not in df.columns:
                missing_columns.append(col)
        
        for col in df.columns:
            if col not in required_columns:
                extra_columns.append(col)
        
        if missing_columns:
            print(f"❌ Missing columns ({len(missing_columns)}):")
            for col in missing_columns:
                print(f"   - '{col}'")
        
        if extra_columns:
            print(f"⚠️  Extra columns ({len(extra_columns)}):")
            for col in extra_columns:
                print(f"   - '{col}'")
        
        if not missing_columns and not extra_columns:
            print("✅ All column names match exactly!")
        
        return missing_columns, extra_columns
        
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return [], []

if __name__ == "__main__":
    # Check your current Excel file
    file_path = "user_data_5_users.xlsx"  # Change this to your file name
    
    print("🔍 Checking Excel file columns...")
    print("=" * 50)
    
    missing, extra = check_excel_columns(file_path)
    
    print("\n" + "=" * 50)
    if missing:
        print("❌ ISSUE: Missing required columns!")
        print("💡 Solution: Add the missing columns to your Excel file")
    elif extra:
        print("⚠️  WARNING: Extra columns found")
        print("💡 Solution: Remove extra columns or check if they're needed")
    else:
        print("✅ Column names are correct!")
        print("💡 Issue might be in data validation or backend processing")
