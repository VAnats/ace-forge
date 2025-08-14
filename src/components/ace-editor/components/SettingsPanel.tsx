import React from 'react';
import { X, Palette, Type, Code, Eye, Keyboard, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { EditorSettings } from '../types';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (settings: Partial<EditorSettings>) => void;
}

const themes = [
  { value: 'ace/theme/monokai', label: 'Monokai' },
  { value: 'ace/theme/github', label: 'GitHub' },
  { value: 'ace/theme/solarized_dark', label: 'Solarized Dark' },
  { value: 'ace/theme/solarized_light', label: 'Solarized Light' },
  { value: 'ace/theme/tomorrow', label: 'Tomorrow' },
  { value: 'ace/theme/tomorrow_night', label: 'Tomorrow Night' },
  { value: 'ace/theme/twilight', label: 'Twilight' },
  { value: 'ace/theme/dracula', label: 'Dracula' },
  { value: 'ace/theme/one_dark', label: 'One Dark' },
  { value: 'ace/theme/cobalt', label: 'Cobalt' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Editor Settings
                </SheetTitle>
                <SheetDescription>
                  Customize your coding experience
                </SheetDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Appearance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <h3 className="font-semibold">Appearance</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => onUpdateSettings({ theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            {theme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => onUpdateSettings({ fontSize: value })}
                      min={10}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tabSize">Tab Size: {settings.tabSize}</Label>
                    <Slider
                      value={[settings.tabSize]}
                      onValueChange={([value]) => onUpdateSettings({ tabSize: value })}
                      min={1}
                      max={8}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Editor */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-semibold">Editor</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wordWrap" className="flex-1">Word Wrap</Label>
                    <Switch
                      id="wordWrap"
                      checked={settings.wordWrap}
                      onCheckedChange={(checked) => onUpdateSettings({ wordWrap: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showGutter" className="flex-1">Show Line Numbers</Label>
                    <Switch
                      id="showGutter"
                      checked={settings.showGutter}
                      onCheckedChange={(checked) => onUpdateSettings({ showGutter: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlightActiveLine" className="flex-1">Highlight Active Line</Label>
                    <Switch
                      id="highlightActiveLine"
                      checked={settings.highlightActiveLine}
                      onCheckedChange={(checked) => onUpdateSettings({ highlightActiveLine: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showPrintMargin" className="flex-1">Show Print Margin</Label>
                    <Switch
                      id="showPrintMargin"
                      checked={settings.showPrintMargin}
                      onCheckedChange={(checked) => onUpdateSettings({ showPrintMargin: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showInvisibles" className="flex-1">Show Invisible Characters</Label>
                    <Switch
                      id="showInvisibles"
                      checked={settings.showInvisibles}
                      onCheckedChange={(checked) => onUpdateSettings({ showInvisibles: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showMinimap" className="flex-1">Show Minimap</Label>
                    <Switch
                      id="showMinimap"
                      checked={settings.showMinimap}
                      onCheckedChange={(checked) => onUpdateSettings({ showMinimap: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Auto Completion */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <h3 className="font-semibold">Auto Completion</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableBasicAutocompletion" className="flex-1">Basic Autocompletion</Label>
                    <Switch
                      id="enableBasicAutocompletion"
                      checked={settings.enableBasicAutocompletion}
                      onCheckedChange={(checked) => onUpdateSettings({ enableBasicAutocompletion: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLiveAutocompletion" className="flex-1">Live Autocompletion</Label>
                    <Switch
                      id="enableLiveAutocompletion"
                      checked={settings.enableLiveAutocompletion}
                      onCheckedChange={(checked) => onUpdateSettings({ enableLiveAutocompletion: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableSnippets" className="flex-1">Code Snippets</Label>
                    <Switch
                      id="enableSnippets"
                      checked={settings.enableSnippets}
                      onCheckedChange={(checked) => onUpdateSettings({ enableSnippets: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Key Bindings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  <h3 className="font-semibold">Key Bindings</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vim" className="flex-1">Vim Mode</Label>
                    <Switch
                      id="vim"
                      checked={settings.vim}
                      onCheckedChange={(checked) => onUpdateSettings({ 
                        vim: checked,
                        emacs: checked ? false : settings.emacs
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="emacs" className="flex-1">Emacs Mode</Label>
                    <Switch
                      id="emacs"
                      checked={settings.emacs}
                      onCheckedChange={(checked) => onUpdateSettings({ 
                        emacs: checked,
                        vim: checked ? false : settings.vim
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => {
                // Reset to defaults
                const defaults: EditorSettings = {
                  theme: 'ace/theme/monokai',
                  fontSize: 14,
                  tabSize: 2,
                  wordWrap: true,
                  showInvisibles: false,
                  showGutter: true,
                  showPrintMargin: true,
                  highlightActiveLine: true,
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showMinimap: false,
                  vim: false,
                  emacs: false,
                };
                onUpdateSettings(defaults);
              }}>
                Reset to Defaults
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};