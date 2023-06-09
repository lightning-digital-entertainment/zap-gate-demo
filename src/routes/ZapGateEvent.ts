import { Event, Kind } from "nostr-tools";
import { store } from "../store";
import { addEvent } from "../state/nostrSlice";

export type SerializableZapGateEvent = {
  eventData: Event;
  kind: Kind;
  id: string;
  url: string;
  relays: string[];
  preview: string[];
  amount: string;
  zap: string[];

}

class ZapGateEvent {
  eventData: Event;
  kind: Kind;
  id: string;
  url: string;
  relays: string[];
  preview: string[];
  amount: string;
  zap: string[];

  constructor(event: Event) {
    this.eventData = event;
    this.kind = event.kind;
    this.id = event.id
    this.url = this.getTagValue(event.tags, 'url')[0]
    this.relays = this.getTagValue(event.tags, 'relays')
    this.preview = this.getTagValue(event.tags, 'preview')
    this.amount = this.getTagValue(event.tags, 'amount')[0]
    this.zap = this.getTagValue(event.tags, 'zap')
  }

  private getTagValue(tags: string[][], tagName: string): string[] {
    const tag = tags.find(([name]) => name === tagName);
    return tag ? tag.slice(1) : [];
  }

  private makeSerializable() {
    return {
      eventData: this.eventData,
      kind: this.kind,
      id: this.id,
      url: this.url,
      relays: this.relays,
      preview: this.preview,
      amount: this.amount,
      zap: this.zap
    }
  }

  saveEvent() {
    const serializableEvent = this.makeSerializable();
    store.dispatch(addEvent(serializableEvent))
  }

}

export default ZapGateEvent;