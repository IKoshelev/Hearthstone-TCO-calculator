export enum Rarity{
	common,rare,epic,legendary
}

export class Slot{
	 public id:number;
	 public rarity: Rarity;
	 public maxInDeck: number;
	 public normalCount = 0;
	 public goldenCount = 0;
	 
	 public getTotal(){
		 return this.normalCount + this.goldenCount;
	 }
	 
	public hasAtLeastMax(){
		 return this.getTotal() >= this.maxInDeck;
	 }
	 
	public hasAtLeastMaxGolden(){
		 return this.goldenCount >= this.maxInDeck;
	 }
	 
	 public hasOverMax(){
		 return this.getTotal() > this.maxInDeck;
	 }
}

export class Collection{
	public slots = new Array<Slot>();
	
	private currentSlotId = 1;
	public addSlots(
		amount:number,
		rarity:Rarity,
		maxInDec:number){
		
		while(amount > 0){
			
			var slot = new Slot();
			slot.rarity = rarity;
			slot.maxInDeck = maxInDec;
			slot.id = this.currentSlotId;
		
			this.slots[this.currentSlotId] = slot;
		
			this.currentSlotId += 1;
			amount -= 1;
		} 
	}
	
	public isComplete(){
		return this.slots.every(x => x.hasAtLeastMax());
	}
	
	public isCompleteGolden(){
		return this.slots.every(x => x.hasAtLeastMaxGolden());
	}
}