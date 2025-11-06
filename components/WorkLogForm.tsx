import React, { useState } from 'react';
import { generateLogDescription } from '../services/geminiService';
import { SparklesIcon } from './icons';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { DatePicker } from './DatePicker';

interface WorkLogFormProps {
  onAddLog: (log: { date: string; hours: number; description: string }) => void;
  formId: string;
}

const WorkLogForm: React.FC<WorkLogFormProps> = ({ onAddLog, formId }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSuggest = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    const suggestedText = await generateLogDescription(description);
    setDescription(suggestedText);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hours || !description) return;

    onAddLog({
      date: date.toLocaleDateString('en-CA'),
      hours: parseFloat(hours),
      description,
    });

    // Reset form
    setDate(new Date());
    setHours('');
    setDescription('');
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">Date</label>
        <DatePicker
          date={date}
          onDateChange={setDate}
        />
      </div>

      <div>
        <label htmlFor="hours" className="block text-sm font-medium text-foreground mb-2">Hours Worked</label>
        <Input
          type="number"
          id="hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="e.g., 4.5"
          step="0.1"
          min="0"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">Description</label>
        <div className="relative">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="Enter a few keywords or a full description..."
            required
          />
          <button
            type="button"
            onClick={handleSuggest}
            disabled={isGenerating || !description.trim()}
            className="absolute bottom-2.5 right-2.5 flex items-center space-x-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold hover:bg-accent disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
            title="Generate description with AI"
          >
            {isGenerating ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
            <span>Suggest</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkLogForm;