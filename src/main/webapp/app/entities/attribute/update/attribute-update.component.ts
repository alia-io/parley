import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAttribute, Attribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

@Component({
  selector: 'jhi-attribute-update',
  templateUrl: './attribute-update.component.html',
})
export class AttributeUpdateComponent implements OnInit {
  isSaving = false;

  questionsSharedCollection: IQuestion[] = [];

  editForm = this.fb.group({
    id: [],
    attributeName: [],
    description: [],
    questions: [],
  });

  constructor(
    protected attributeService: AttributeService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attribute }) => {
      this.updateForm(attribute);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attribute = this.createFromForm();
    if (attribute.id !== undefined) {
      this.subscribeToSaveResponse(this.attributeService.update(attribute));
    } else {
      this.subscribeToSaveResponse(this.attributeService.create(attribute));
    }
  }

  trackQuestionById(index: number, item: IQuestion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttribute>>): void {
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

  protected updateForm(attribute: IAttribute): void {
    this.editForm.patchValue({
      id: attribute.id,
      attributeName: attribute.attributeName,
      description: attribute.description,
      questions: attribute.questions,
    });

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing(
      this.questionsSharedCollection,
      attribute.questions
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing(questions, this.editForm.get('questions')!.value)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }

  protected createFromForm(): IAttribute {
    return {
      ...new Attribute(),
      id: this.editForm.get(['id'])!.value,
      attributeName: this.editForm.get(['attributeName'])!.value,
      description: this.editForm.get(['description'])!.value,
      questions: this.editForm.get(['questions'])!.value,
    };
  }
}
