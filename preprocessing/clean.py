import pandas as pd

#Python script used to process the business file to get rid of businesses without hours, city or hours
json = pd.read_json('business.json', lines=True)
df = pd.DataFrame(json)
df = df.replace(0, pd.np.nan).dropna(axis=0, how='any', subset=['is_open'])
print(df.count())
indexNames = df[ (df['is_open'] == 0) |  (df['city'].isnull()) | (df['hours'].isnull()) ].index
df.drop(indexNames , inplace=True)
print(df.count())
df.to_csv (r'./business.csv', index = False, header=True)
