import google.generativeai as genai

# Klistra in din egen API-nyckel här
genai.configure(api_key="AQ.Ab8RN6ITkoFPiRz4I2i6viJgYGWCGT3xpTwduvHWl1ka7UGqaQ")

print("Dina tillgängliga modeller:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)