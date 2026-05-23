import pandas as pd

# Load the dataset
df = pd.read_csv('data/data_science_salaries.csv')

# 1. See the first 5 rows
print("=== First 5 Rows ===")
print(df.head())

# 2. See all column names
print("\n=== Columns ===")
print(df.columns.tolist())

# 3. See the shape (rows x columns)
print("\n=== Shape ===")
print(df.shape)

# 4. Check for missing values
print("\n=== Missing Values ===")
print(df.isnull().sum())

# 5. Basic statistics
print("\n=== Basic Stats ===")
print(df.describe())