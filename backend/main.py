import os
import json
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Optional
from openai import OpenAI

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── NVIDIA NIM API Configuration ────────────────────────────────────────────
NVIDIA_API_KEY = os.getenv(
    "NVIDIA_API_KEY",
    "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"
)
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

# OpenAI API key for chatbot (GPT-OSS-120B)
OPENAI_NIM_API_KEY = os.getenv(
    "OPENAI_NIM_API_KEY",
    "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"
)

# Language code to full name mapping
LANGUAGE_MAP = {
    "en": "English", "hi": "Hindi", "ta": "Tamil", "te": "Telugu",
    "kn": "Kannada", "ml": "Malayalam", "bn": "Bengali", "mr": "Marathi",
    "gu": "Gujarati", "pa": "Punjabi", "or": "Odia", "as": "Assamese",
    "ur": "Urdu", "sa": "Sanskrit", "kok": "Konkani", "mni": "Manipuri",
    "ne": "Nepali", "sd": "Sindhi", "doi": "Dogri", "ks": "Kashmiri",
    "brx": "Bodo", "sat": "Santhali", "mai": "Maithili"
}

# ─── Translation Endpoint ────────────────────────────────────────────────────

class TranslationRequest(BaseModel):
    enJson: dict
    targetLang: str

@app.post("/api/translate-ui")
async def translate_ui(req: TranslationRequest):
    api_key = os.getenv("TRANSLATION_API_KEY", NVIDIA_API_KEY)
    if not api_key:
        raise HTTPException(status_code=500, detail="Translation API key missing on server")

    prompt = f"""Translate the following JSON values into the {req.targetLang} language. 
Return ONLY valid JSON.
Do not add explanations.
Do not change JSON keys.
Keep railway safety terms meaningful. Keep PRAHARI as PRAHARI.
Keep numbers, report IDs, train numbers, coordinates, and technical values unchanged.
For Indian languages, use correct native script Unicode. For Urdu, use proper Urdu script.

Source JSON:
{json.dumps(req.enJson, indent=2)}"""

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": "meta/llama-3.1-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "max_tokens": 4096,
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(NVIDIA_BASE_URL, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
            
        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        translated_json = json.loads(content)
        return translated_json
    except Exception as e:
        print(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate translations")


# ─── AI Hazard Scanner Endpoint ──────────────────────────────────────────────

class ScanRequest(BaseModel):
    base64Image: str

@app.post("/api/scan-hazard")
async def scan_hazard(req: ScanRequest):
    base64_data = req.base64Image
    mime_type = "image/jpeg"
    
    if req.base64Image.startswith("data:"):
        parts = req.base64Image.split(";base64,")
        mime_type = parts[0].split(":")[1]
        base64_data = parts[1]

    system_prompt = """You are PRAHARI Railway Safety Intelligence System. Carefully visually analyze the uploaded railway image.

Search the image for any of these specific Hazard Types: [Track Crack, Track Misalignment, Broken Sleeper, Track Obstruction, Fallen Tree, Rock on Track, Animal Intrusion, Cow, Elephant, Dog, Buffalo, Human Intrusion, Coach Damage, Broken Door, Broken Window, Fire, Smoke, Electrical Hazard, Signal Damage, Water Logging, Landslide, Debris, Garbage on Track]. 

Determine the Operational Impact, Passenger Safety Impact, and Recommended Action based on what you see.

Respond ONLY with a valid JSON object matching exactly this schema:
{
  "hazardType": "string",
  "confidence": "string (e.g. 96.4%)",
  "operationalImpact": "string",
  "passengerSafetyImpact": "string",
  "aiExplanation": "string (concise professional analysis of what you see)",
  "recommendedAction": "string"
}

If no hazard is found, return hazardType as "No Hazard Detected"."""

    # NVIDIA NIM - Llama 3.2 90B Vision Instruct
    headers = {
        "Authorization": "Bearer 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",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "meta/llama-3.2-90b-vision-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": system_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{base64_data}"}}
                ]
            }
        ],
        "max_tokens": 512,
        "temperature": 1.00,
        "top_p": 1.00,
        "frequency_penalty": 0.00,
        "presence_penalty": 0.00,
        "stream": False
    }

    try:
        response = requests.post(NVIDIA_BASE_URL, headers=headers, json=payload)
        
        if response.status_code != 200:
            print(f"NVIDIA API Error ({response.status_code}): {response.text}")
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        # Clean markdown formatting and extract JSON from output
        content = content.strip()
        start = content.find('{')
        end = content.rfind('}')
        if start != -1 and end != -1:
            json_string = content[start:end+1]
        else:
            json_string = content
            
        parsed_data = json.loads(json_string)
        return parsed_data
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse error: {e}, Raw content: {content[:500]}")
        raise HTTPException(status_code=500, detail="AI returned invalid JSON format")
    except Exception as e:
        print(f"Scanner error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to scan image: {str(e)}")


# ─── Chatbot Endpoint ────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: Optional[str] = "en"

@app.post("/api/chat")
async def chat(req: ChatRequest):
    # Resolve language name from code
    lang_name = LANGUAGE_MAP.get(req.language, "English")

    # Build system prompt with language instruction
    system_prompt = f"""You are PRAHARI AI Assistant — a helpful, concise, and knowledgeable railway safety chatbot for Indian Railways citizens.

IMPORTANT: You MUST respond ONLY in {lang_name} language. Every word of your response must be in {lang_name}. Do not mix languages.

Your capabilities:
- Answer questions about railway safety, rules, and procedures
- Guide users on how to report hazards, track obstructions, fires, animal intrusions, and other railway safety issues
- Explain PRAHARI app features: SOS alerts, AI Hazard Scanner, Crowd Verification, Safety Map, and Safety Rewards
- Provide emergency helpline numbers for Indian Railways (Railway Protection Force: 182, Railway Helpline: 139)
- Help users understand hazard severity levels and risk assessment
- Offer first-aid and safety tips for railway emergencies

Rules:
- ALWAYS respond in {lang_name}. This is mandatory.
- Be concise and helpful. Keep responses under 150 words unless the user asks for detail.
- Always prioritize safety. If someone reports an emergency, urge them to use the SOS feature immediately.
- Be professional but friendly. You represent Indian Railway safety.
- If unsure, say so honestly. Never fabricate safety information."""

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key="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"
    )

    # Build messages with system prompt
    messages = [{"role": "system", "content": system_prompt}]
    for msg in req.messages:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=1,
            top_p=1,
            max_tokens=4096,
            stream=False
        )
        
        # Handle reasoning content if present
        reasoning = getattr(completion.choices[0].message, "reasoning_content", None)
        if reasoning:
            print(f"Reasoning: {reasoning[:200]}")
        
        content = completion.choices[0].message.content
        
        return {"reply": content}
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# To run this server locally:
# uvicorn main:app --reload --port 8000

