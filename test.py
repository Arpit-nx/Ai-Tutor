import os
import google.generativeai as genai
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
models = genai.list_models()
for model in models:
    print(model.name)