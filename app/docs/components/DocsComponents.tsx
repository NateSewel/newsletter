import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-btn";

export const CodeBlock = ({
  children,
  language = "json",
}: {
  children: string;
  language?: string;
}) => (
  <div className="relative bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
    <div className="flex items-center justify-between mb-2">
      <Badge
        variant="outline"
        className="text-xs text-gray-400 border-gray-600"
      >
        {language}
      </Badge>
      <CopyButton value={children} className="text-gray-400 hover:text-white" />
    </div>
    <pre className="text-gray-100">
      <code>{children}</code>
    </pre>
  </div>
);

export const MethodBadge = ({ method }: { method: string }) => {
  const colors = {
    GET: "bg-green-100 text-green-800 border-green-200",
    POST: "bg-blue-100 text-blue-800 border-blue-200",
    PATCH: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DELETE: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge
      className={`font-mono font-bold ${colors[method as keyof typeof colors]}`}
    >
      {method}
    </Badge>
  );
};

export const EndpointCard = ({
  method,
  path,
  title,
  description,
  example,
  response,
}: {
  method: string;
  path: string;
  title: string;
  description: string;
  example?: string;
  response: string;
}) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center gap-3">
        <MethodBadge method={method} />
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {path}
          </code>
        </div>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {example && (
        <div>
          <h4 className="font-semibold mb-2 text-sm">Request Example</h4>
          <CodeBlock language="bash">{example}</CodeBlock>
        </div>
      )}
      <div>
        <h4 className="font-semibold mb-2 text-sm">Response Example</h4>
        <CodeBlock>{response}</CodeBlock>
      </div>
    </CardContent>
  </Card>
);
