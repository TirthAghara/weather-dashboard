import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  @Output() search = new EventEmitter<string>();
  
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe((query) => {
      if (query.trim()) {
        this.search.emit(query.trim());
      }
    });
  }

  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }

  onSubmit() {
    if (this.searchQuery.trim()) {
      // Immediate emit on manual submit (e.g. Enter key pressed)
      this.search.emit(this.searchQuery.trim());
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
