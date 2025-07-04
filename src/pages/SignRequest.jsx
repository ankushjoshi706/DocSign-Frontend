import { useState } from "react";
import { Mail, FileText, CheckCircle, Loader2, Inbox, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";

export default function SignRequest() {
  const [recipient, setRecipient] = useState("");
  const [docId, setDocId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(recipient)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/email/request-signature", { recipient, docId });
      setSuccess(true);
      toast.success("Signature request sent! ✅");
    } catch {
      toast.error("Failed to send signature request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-20 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative group bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-3xl p-10 backdrop-blur-md space-y-8 transition-all duration-300 hover:shadow-2xl hover:border-accent/40">

        {/* Top Icon */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent text-white p-3 rounded-full shadow-lg">
          <Inbox className="h-6 w-6" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white relative inline-block after:block after:h-1 after:w-12 after:mt-1 after:mx-auto after:bg-accent after:rounded-full">
            Signature Request
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Securely send a document for e-signature
          </p>
        </div>

        <hr className="border-t border-gray-200 dark:border-zinc-700" />

        {/* Success State */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-3"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
              <p className="text-green-600 font-medium">Request Sent!</p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSuccess(false);
                  setRecipient("");
                  setDocId("");
                }}
                className="text-sm text-accent hover:underline"
              >
                Send another request
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                placeholder=" "
                className="peer w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 dark:text-gray-400 left-3 top-3 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:left-3 peer-focus:text-sm peer-focus:text-accent"
              >
                <Mail size={14} className="inline mr-1" />
                Recipient Email
              </label>
            </div>

            {/* Document ID */}
            <div className="relative">
              <input
                type="text"
                id="docId"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                required
                placeholder=" "
                className="peer w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
              />
              <label
                htmlFor="docId"
                className="absolute text-sm text-gray-500 dark:text-gray-400 left-3 top-3 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:left-3 peer-focus:text-sm peer-focus:text-accent"
              >
                <FileText size={14} className="inline mr-1" />
                Document ID
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-accent to-rose-600 hover:to-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Signature Request
                </>
              )}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
