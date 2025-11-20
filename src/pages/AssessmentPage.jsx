import React from "react";

function AssessmentPage() {
  // State to store answers
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [descAnswers, setDescAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const mcqs = [
    "MCQ 1: What is your study schedule like?",
    "MCQ 2: How consistently do you study?",
    "MCQ 3: Do you solve PYQs daily?",
    "MCQ 4: How strong are your fundamentals?",
    "MCQ 5: Do you revise weekly?",
    "MCQ 6: How well do you manage time?",
    "MCQ 7: Are you confident in PCM equally?",
    "MCQ 8: How many hours do you study?",
    "MCQ 9: How do you analyze mistakes?",
    "MCQ 10: Do you follow a test series?",
  ];

  const descriptive = [
    "Describe your weak areas.",
    "Describe your strong areas.",
    "What distracts you the most?",
    "How do you revise?",
    "What is your study strategy for the next 30 days?"
  ];

  // Handle MCQ changes
  const handleMcqChange = (index, value) => {
    setMcqAnswers((prev) => ({ ...prev, [`Question ${index + 1}`]: value }));
  };

  // Handle Descriptive changes
  const handleDescChange = (index, value) => {
    setDescAnswers((prev) => ({ ...prev, [`Question ${index + 1}`]: value }));
  };

  // Handle Submit
  const handleSubmit = () => {
    const finalData = { ...mcqAnswers, ...descAnswers };
    console.log("Submitted Data:", finalData);
    setSubmitted(true);
    // Just added, will discuss about it later
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-8 border-b-2 border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-slate-900">JEE Mentorship Assessment</h1>
          <p className="text-slate-600 mt-2">Please answer honestly to help us tailor your mentorship plan.</p>
        </header>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center animate-fade-in">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Assessment Submitted!</h2>
            <p className="text-green-700">Your responses have been recorded. Your mentor will review them shortly.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 text-green-700 hover:text-green-900 underline"
            >
              Edit Responses
            </button>
          </div>
        ) : (
          <div className="space-y-10">

            {/* Section 1: MCQs */}
            <section>
              <h2 className="text-xl font-bold text-indigo-700 bg-indigo-50 inline-block px-4 py-2 rounded-lg mb-6">
                Part 1: Multiple Choice (10 Questions)
              </h2>
              <div className="grid gap-6">
                {mcqs.map((q, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <label className="block font-semibold text-slate-800 mb-3">{q}</label>
                    <select
                      className="w-full md:w-1/2 p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      onChange={(e) => handleMcqChange(i, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select the best option</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                      <option value="Average">Average</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Descriptive */}
            <section>
              <h2 className="text-xl font-bold text-indigo-700 bg-indigo-50 inline-block px-4 py-2 rounded-lg mb-6">
                Part 2: Descriptive Analysis (5 Questions)
              </h2>
              <div className="grid gap-6">
                {descriptive.map((q, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <label className="block font-semibold text-slate-800 mb-3">{q}</label>
                    <textarea
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[100px] resize-y transition-all"
                      placeholder="Type your detailed answer here..."
                      onChange={(e) => handleDescChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6 pb-12 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                <span>Submit Assessment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AssessmentPage;