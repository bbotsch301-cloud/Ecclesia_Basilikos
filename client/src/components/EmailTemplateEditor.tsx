import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Mail, Save, RefreshCw } from "lucide-react";

interface EmailTemplateField {
  id: string;
  pageName: string;
  contentKey: string;
  contentValue: string;
  contentType: 'text' | 'html';
  description?: string;
  updatedAt: string;
}

const emailTemplateFields = [
  { key: 'verification_subject', label: 'Email Subject', type: 'text', description: 'Subject line for verification emails' },
  { key: 'verification_header_title', label: 'Header Title', type: 'text', description: 'Main title in email header' },
  { key: 'verification_header_subtitle', label: 'Header Subtitle', type: 'text', description: 'Subtitle in email header' },
  { key: 'verification_greeting', label: 'Greeting', type: 'text', description: 'Email greeting (use {{firstName}} for personalization)' },
  { key: 'verification_main_message', label: 'Main Message', type: 'text', description: 'Primary welcome message' },
  { key: 'verification_instruction_text', label: 'Instructions', type: 'text', description: 'Instructions for verification' },
  { key: 'verification_button_text', label: 'Button Text', type: 'text', description: 'Verification button text' },
  { key: 'verification_expiration_text', label: 'Expiration Notice', type: 'text', description: 'Link expiration information' },
  { key: 'verification_scripture_quote', label: 'Scripture Quote', type: 'text', description: 'Bible verse text' },
  { key: 'verification_scripture_reference', label: 'Scripture Reference', type: 'text', description: 'Bible verse reference' },
  { key: 'verification_benefits_list', label: 'Benefits List', type: 'html', description: 'HTML list of platform benefits' },
  { key: 'verification_closing_message', label: 'Closing Message', type: 'html', description: 'Closing message and signature' },
  { key: 'verification_footer_text', label: 'Footer Text', type: 'text', description: 'Main footer text' },
  { key: 'verification_footer_subtext', label: 'Footer Subtext', type: 'text', description: 'Additional footer information' },
];

export default function EmailTemplateEditor() {
  const { toast } = useToast();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const { data: emailTemplates, isLoading } = useQuery<EmailTemplateField[]>({
    queryKey: ['/api/admin/page-content'],
    select: (data) => data?.filter(item => item.pageName === 'email-templates') || []
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { contentValue: string } }) => {
      const response = await fetch(`/api/admin/page-content/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-content'] });
      const field = emailTemplateFields.find(f => emailTemplates?.find(t => t.id === variables.id)?.contentKey === f.key);
      toast({
        title: "Email Template Updated",
        description: `${field?.label || 'Template field'} has been updated successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update email template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleValueChange = (templateId: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [templateId]: value }));
  };

  const handleSave = (templateId: string) => {
    const newValue = editedValues[templateId];
    if (newValue !== undefined) {
      updateTemplateMutation.mutate({ 
        id: templateId, 
        data: { contentValue: newValue } 
      });
      // Clear the edited value after saving
      setEditedValues(prev => {
        const updated = { ...prev };
        delete updated[templateId];
        return updated;
      });
    }
  };

  const handleReset = (templateId: string) => {
    setEditedValues(prev => {
      const updated = { ...prev };
      delete updated[templateId];
      return updated;
    });
  };

  const getCurrentValue = (template: EmailTemplateField) => {
    return editedValues[template.id] !== undefined ? editedValues[template.id] : template.contentValue;
  };

  const hasChanges = (templateId: string) => {
    return editedValues[templateId] !== undefined;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading email templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Verification Template
          </CardTitle>
          <CardDescription>
            Customize the email content sent to new users for email verification. Use {"{{"+"firstName"+"}"+"}"} in any field for personalization.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {emailTemplateFields.map((field) => {
          const template = emailTemplates?.find(t => t.contentKey === field.key);
          if (!template) return null;

          return (
            <Card key={field.key} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                  {field.label}
                  <div className="flex gap-2">
                    {hasChanges(template.id) && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReset(template.id)}
                          data-testid={`button-reset-${field.key}`}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSave(template.id)}
                          disabled={updateTemplateMutation.isPending}
                          data-testid={`button-save-${field.key}`}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          {updateTemplateMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  {field.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {field.type === 'html' ? (
                  <Textarea
                    value={getCurrentValue(template)}
                    onChange={(e) => handleValueChange(template.id, e.target.value)}
                    className="min-h-[120px] font-mono text-sm"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    data-testid={`textarea-${field.key}`}
                  />
                ) : (
                  <Input
                    value={getCurrentValue(template)}
                    onChange={(e) => handleValueChange(template.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    data-testid={`input-${field.key}`}
                  />
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Last updated: {new Date(template.updatedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(editedValues).length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            You have {Object.keys(editedValues).length} unsaved change(s). Make sure to save your changes before leaving this page.
          </p>
        </div>
      )}
    </div>
  );
}