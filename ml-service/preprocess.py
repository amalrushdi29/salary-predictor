import pandas as pd
from sklearn.model_selection import train_test_split

# ── Load the dataset ──────────────────────────────────────────
df = pd.read_csv('data/data_science_salaries.csv')

# ── Step 1: Keep only the columns we need ────────────────────
columns_to_keep = [
    'job_title',
    'experience_level',
    'work_models',
    'company_location',
    'company_size',
    'salary_in_usd'
]
df = df[columns_to_keep]

# ── Step 2: Remove duplicates ─────────────────────────────────
df = df.drop_duplicates()

# ── Step 3: Remove salary outliers ───────────────────────────
df = df[(df['salary_in_usd'] >= 15000) & (df['salary_in_usd'] <= 500000)]

# ── Step 4: Group rare job titles ────────────────────────────
top_jobs = df['job_title'].value_counts().nlargest(20).index
df['job_title'] = df['job_title'].apply(
    lambda x: x if x in top_jobs else 'Other'
)

# ── Step 5: Group locations into regions ─────────────────────
region_map = {
    'United States': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'United Kingdom': 'Europe',
    'Germany': 'Europe',
    'France': 'Europe',
    'Spain': 'Europe',
    'Netherlands': 'Europe',
    'Portugal': 'Europe',
    'Italy': 'Europe',
    'Sweden': 'Europe',
    'Denmark': 'Europe',
    'Norway': 'Europe',
    'Finland': 'Europe',
    'Belgium': 'Europe',
    'Switzerland': 'Europe',
    'Austria': 'Europe',
    'Poland': 'Europe',
    'Greece': 'Europe',
    'Romania': 'Europe',
    'Czech Republic': 'Europe',
    'Hungary': 'Europe',
    'Ukraine': 'Europe',
    'Croatia': 'Europe',
    'India': 'Asia',
    'China': 'Asia',
    'Japan': 'Asia',
    'Singapore': 'Asia',
    'South Korea': 'Asia',
    'Pakistan': 'Asia',
    'Philippines': 'Asia',
    'Indonesia': 'Asia',
    'Malaysia': 'Asia',
    'Thailand': 'Asia',
    'Vietnam': 'Asia',
    'Bangladesh': 'Asia',
    'Sri Lanka': 'Asia',
    'Iran': 'Asia',
    'Turkey': 'Asia',
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Colombia': 'South America',
    'Chile': 'South America',
    'Ecuador': 'South America',
    'Bolivia': 'South America',
    'Honduras': 'South America',
    'Australia': 'Oceania',
    'New Zealand': 'Oceania',
    'Nigeria': 'Africa',
    'Kenya': 'Africa',
    'Egypt': 'Africa',
    'Ghana': 'Africa',
    'Algeria': 'Africa',
    'Tunisia': 'Africa',
    'South Africa': 'Africa',
    'Morocco': 'Africa',
}
df['company_location'] = df['company_location'].map(region_map).fillna('Other')

# ── Step 6: Separate features and target ─────────────────────
X = df.drop(columns=['salary_in_usd'])  # features (inputs)
y = df['salary_in_usd']                 # target (what we predict)

# ── Step 7: Train/Test Split ──────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,      # 20% for testing
    random_state=42     # makes the split consistent every time
)

# ── Step 8: Save all four splits ──────────────────────────────
X_train.to_csv('data/X_train.csv', index=False)
X_test.to_csv('data/X_test.csv', index=False)
y_train.to_csv('data/y_train.csv', index=False)
y_test.to_csv('data/y_test.csv', index=False)

print(f"✅ Training set size: {X_train.shape}")
print(f"✅ Testing set size:  {X_test.shape}")
print("\n✅ All files saved to data/")