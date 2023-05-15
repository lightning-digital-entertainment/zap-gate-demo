import { Event, Kind } from "nostr-tools";

class ZapGateEvent {
  kind: Kind;
  id: string;
  url: string;
  relays: string[];
  preview: string[]

  constructor(event: Event) {
    this.kind = event.kind;
    this.id = event.id
    this.url = this.getTagValue(event.tags, 'url')[0]
    this.relays = this.getTagValue(event.tags, 'relays')
    this.preview = this.getTagValue(event.tags, 'preview')
  }

  private getTagValue(tags: string[][], tagName: string): string[] {
    const tag = tags.find(([name]) => name === tagName);
    return tag ? tag.slice(1) : [];
  }
}

export default ZapGateEvent;