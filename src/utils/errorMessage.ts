/**
 * User-Friendly Error Mapper
 * Maps technical AI and network exceptions to safe, non-sensitive, actionable user messages.
 * Prevents API key exposure while giving users clear guidance.
 */

export function getUserFriendlyErrorMessage(err: unknown, language: 'en' | 'hi' | 'mr' = 'en'): string {
  const msg = err instanceof Error ? err.message : String(err || '');
  const lower = msg.toLowerCase();

  // Quota & Rate Limits
  if (lower.includes('quota') || lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('rate limit')) {
    if (language === 'hi') return 'Gemini कोटा समाप्त हो गया है। कृपया थोड़ी देर बाद पुन: प्रयास करें।';
    if (language === 'mr') return 'Gemini कोटा संपला आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.';
    return 'Gemini quota has been exceeded. Please try again in a few moments.';
  }

  // Missing or Invalid API key / Configuration
  if (lower.includes('api key') || lower.includes('apikey') || lower.includes('unregistered') || lower.includes('not configured')) {
    if (language === 'hi') return 'AI कॉन्फ़िगरेशन अनुपलब्ध है। कृपया सेटिंग्स में API कुंजी जांचें।';
    if (language === 'mr') return 'AI कॉन्फिगरेशन उपलब्ध नाही. कृपया सेटिंग्जमध्ये API की तपासा.';
    return 'AI configuration is unavailable. Please check your API key in Settings.';
  }

  // Permission Denied / Key Rejected / Model access restricted
  if (lower.includes('permission_denied') || lower.includes('forbidden') || lower.includes('403') || lower.includes('rejected')) {
    if (language === 'hi') return 'Gemini API अनुरोध अस्वीकृत कर दिया गया। कृपया API कुंजी अनुमतियाँ जांचें।';
    if (language === 'mr') return 'Gemini API विनंती नाकारली गेली. कृपया API की परवानग्या तपासा.';
    return 'Gemini API request was rejected. Please verify your API key permissions.';
  }

  // Timeout / Deadline
  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('deadline') || lower.includes('aborted')) {
    if (language === 'hi') return 'विश्लेषण का समय समाप्त हो गया। कृपया पुन: प्रयास करें।';
    if (language === 'mr') return 'विश्लेषण वेळ संपली. कृपया पुन्हा प्रयत्न करा.';
    return 'Analysis timed out. Please try analyzing a shorter document or retry.';
  }

  // Network / Offline / Connection errors
  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('econnrefused') || lower.includes('offline') || lower.includes('networkerror')) {
    if (language === 'hi') return 'नेटवर्क अनुरोध विफल रहा। कृपया अपना इंटरनेट कनेक्शन जांचें।';
    if (language === 'mr') return 'नेटवर्क विनंती अयशस्वी झाली. कृपया आपले इंटरनेट कनेक्शन तपासा.';
    return 'Network request failed. Please check your internet connection and try again.';
  }

  // Default fallback
  if (language === 'hi') return 'विश्लेषण विफल रहा। कृपया पुन: प्रयास करें।';
  if (language === 'mr') return 'विश्लेषण अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.';
  return 'Analysis failed. Please try again.';
}
