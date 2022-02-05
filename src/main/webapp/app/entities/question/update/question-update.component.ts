import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { AttributeService } from 'app/entities/attribute/service/attribute.service';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;

  attributesSharedCollection: IAttribute[] = [];

  editForm = this.fb.group({
    id: [],
    questionName: [],
    question: [],
    attributes: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected attributeService: AttributeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.updateForm(question);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  trackAttributeById(index: number, item: IAttribute): number {
    return item.id!;
  }

  getSelectedAttribute(option: IAttribute, selectedVals?: IAttribute[]): IAttribute {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      id: question.id,
      questionName: question.questionName,
      question: question.question,
      attributes: question.attributes,
    });

    this.attributesSharedCollection = this.attributeService.addAttributeToCollectionIfMissing(
      this.attributesSharedCollection,
      ...(question.attributes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attributeService
      .query()
      .pipe(map((res: HttpResponse<IAttribute[]>) => res.body ?? []))
      .pipe(
        map((attributes: IAttribute[]) =>
          this.attributeService.addAttributeToCollectionIfMissing(attributes, ...(this.editForm.get('attributes')!.value ?? []))
        )
      )
      .subscribe((attributes: IAttribute[]) => (this.attributesSharedCollection = attributes));
  }

  protected createFromForm(): IQuestion {
    return {
      ...new Question(),
      id: this.editForm.get(['id'])!.value,
      questionName: this.editForm.get(['questionName'])!.value,
      question: this.editForm.get(['question'])!.value,
      attributes: this.editForm.get(['attributes'])!.value,
    };
  }
}
