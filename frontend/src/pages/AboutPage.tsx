export default function AboutPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10 space-y-8">

      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl font-bold dark:text-slate-100 text-slate-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          What does this app do?
        </h2>
        <p className="dark:text-slate-300 text-slate-600 leading-relaxed">
          You upload a brain MRI scan and the app tells you whether it looks like a tumour is present or not. It also highlights the exact region of the image the AI focused on when making its decision, so you can see its reasoning rather than just taking a number on faith.
        </p>
        <p className="dark:text-slate-400 text-slate-500 text-sm leading-relaxed">
          This is a university cloud project. It is not a medical device and must not be used for diagnosis or clinical decisions.
        </p>
      </div>

      <div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
        <h2 className="text-2xl font-bold dark:text-slate-100 text-slate-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          How it works
        </h2>

        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "You upload a scan",
              body: "A JPEG or PNG of a brain MRI. The image goes directly to our backend running on Render — nothing is stored beyond what you submit.",
            },
            {
              step: "02",
              title: "EfficientNet-B0 classifies it",
              body: "EfficientNet-B0 is a compact but powerful image recognition model developed by Google. We fine-tuned it on a labelled dataset of 253 brain MRI scans (155 with tumour, 98 healthy). It learned to spot the visual patterns that distinguish a tumour scan from a healthy one.",
            },
            {
              step: "03",
              title: "Grad-CAM shows why",
              body: "Gradient-weighted Class Activation Mapping (Grad-CAM) traces which pixels drove the model's decision and overlays a heatmap on the original image. Red areas matter most, blue areas matter least. This turns a black-box percentage into something you can actually look at.",
            },
            {
              step: "04",
              title: "You get the result",
              body: "The app returns a label (Tumour / No Tumour), a probability percentage, the Grad-CAM overlay, and a plain-English explanation. Results are saved to MongoDB so you can review your history.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full dark:bg-mri-700 bg-slate-100 dark:border dark:border-mri-border border border-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold dark:text-cyan-400 text-cyan-600">{step}</span>
              </div>
              <div>
                <p className="font-semibold dark:text-slate-200 text-slate-700 mb-1">{title}</p>
                <p className="text-sm dark:text-slate-400 text-slate-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

<div className="dark:bg-mri-800 dark:border dark:border-mri-border bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
        <h2 className="text-2xl font-bold dark:text-slate-100 text-slate-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Training at a glance
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { stat: "253", label: "Total scans" },
            { stat: "155", label: "Tumour scans" },
            { stat: "98", label: "Healthy scans" },
            { stat: "EfficientNet-B0", label: "Model backbone" },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold dark:text-cyan-400 text-cyan-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>{stat}</p>
              <p className="text-xs dark:text-slate-500 text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
