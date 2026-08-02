import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 border-b border-gray-200 pb-2 text-2xl font-semibold text-gray-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-900">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-7 text-gray-700">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-blue-300 bg-blue-50/50 py-2 pl-4 text-gray-700 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-100">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-3 py-2">{children}</td>
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
};

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="text-[15px]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
