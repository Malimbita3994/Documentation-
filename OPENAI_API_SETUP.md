# 🔑 OpenAI API Key Setup Guide

## 🚨 **Current Issue: Invalid API Key**

The error message indicates that your OpenAI API key is invalid:
```
Error: AI API Error: Incorrect API key provided: sk-proj-***************************************************************************************************************************************************************-ZUA
```

## 🔧 **How to Fix This:**

### **Step 1: Get a Valid OpenAI API Key**

1. **Visit OpenAI Platform**: Go to [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

2. **Sign In**: Make sure you're logged into your OpenAI account

3. **Create New API Key**:
   - Click "Create new secret key"
   - Name it something like "IDAP Documentation"
   - Click "Create secret key"

4. **Copy the Key**: The new key should:
   - Start with `sk-`
   - Be approximately 51 characters long
   - Look like: `sk-1234567890abcdef1234567890abcdef1234567890abcdef`

### **Step 2: Create Environment File**

Create a `.env` file in the `frontend/` directory with this content:

```env
# AI Service Configuration
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here

# Application Configuration
VITE_API_URL=http://localhost:8000/api
VITE_FRONTEND_URL=http://localhost:3000
VITE_ENV=development
```

**Replace `sk-your-actual-api-key-here` with your actual API key**

### **Step 3: Restart Development Server**

After creating the `.env` file:

1. Stop the development server (Ctrl+C)
2. Start it again: `npm run dev`

### **Step 4: Test the Integration**

1. Go to `http://localhost:3000`
2. Scroll down to the "🤖 AI Integration Test" section
3. Click "Test AI Integration"
4. You should see a successful AI response

## 🎯 **Common Issues & Solutions:**

### **Issue 1: "Incorrect API key provided"**
- **Solution**: Make sure you copied the entire key correctly
- **Check**: Key should start with `sk-` and be ~51 characters

### **Issue 2: "The model does not exist or you do not have access to it"**
- **Solution**: The application uses `gpt-4o` model. Make sure your OpenAI account has access to GPT-4 models
- **Alternative**: If you don't have GPT-4 access, you can use `gpt-3.5-turbo` (update the model in `aiService.ts`)

### **Issue 3: "You exceeded your current quota"**
- **Solution**: Add billing information to your OpenAI account
- **Check**: Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
- **Alternative**: The application now provides enhanced fallback content when quota is exceeded
- **Free Credits**: Check [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage) for remaining free credits

### **Issue 4: "Rate limit exceeded"**
- **Solution**: Wait a few minutes and try again
- **Alternative**: Upgrade your OpenAI plan

### **Issue 5: "Environment file not found"**
- **Solution**: Make sure `.env` file is in the `frontend/` directory
- **Check**: File should be named exactly `.env` (not `.env.txt`)

## 🔒 **Security Notes:**

1. **Never commit your API key** to version control
2. **Keep your key private** - don't share it publicly
3. **Monitor usage** to avoid unexpected charges
4. **Use environment variables** for production deployment

## 🎉 **Success Indicators:**

When working correctly, you should see:
- ✅ "AI Response: [actual AI-generated content]"
- ✅ SRS modal "Auto-Populate Introduction" button works
- ✅ Real AI-generated content in document sections
- ✅ Console logs showing which model was successfully used

## 🔄 **Automatic Model Fallback:**

The application now automatically tries different models in this order:
1. `gpt-4o` (primary - best quality)
2. `gpt-4o-mini` (fallback - good quality, lower cost)
3. `gpt-3.5-turbo` (final fallback - basic access)

If one model fails, it automatically tries the next one!

## 🛡️ **Enhanced Fallback System:**

When all AI models fail (due to quota, billing, or access issues), the application provides:
- **Contextual Content**: Tailored responses based on your request
- **Professional Structure**: IEEE-compliant document templates
- **Industry Standards**: Best practices and guidelines
- **Clear Guidance**: Instructions for resolving API issues

This ensures you can continue working even without AI access!

## 🆘 **Still Having Issues?**

If you continue to have problems:

1. **Check OpenAI Account**: Ensure your account is active and has credits
2. **Verify Key Format**: Make sure the key starts with `sk-`
3. **Test in OpenAI Playground**: Try your key at [https://platform.openai.com/playground](https://platform.openai.com/playground)
4. **Contact Support**: If all else fails, contact OpenAI support

---

**Once you have a valid API key, IDAP will generate real, professional documents using AI!** 🚀
